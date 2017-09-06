// @flow

import path from 'path'
import webpack from 'webpack'
import { WDS_PORT } from './src/shared/config'
import DashboardPlugin from 'webpack-dashboard/plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'


let config = {
  entry:  __dirname + "/src/client/index.js",
  output: {
    filename: 'public/js/bundle.js',
    path: __dirname + "/public"
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|json|mp3|eot|svg|ttf|woff|woff2)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /(\.glsl|\.frag|\.vert|\.dae)$/, loader: 'raw-loader'   },
      { test: /(\.glsl|\.frag|\.vert)$/, loader: 'glslify' },
      { test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader'},
      { test: /\.html$/, use:[{
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }

        }
      ]}
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      client_path: path.resolve(__dirname, 'src/client'),
      objects_path: path.resolve(__dirname, 'src/client/objects'),
      modules_path: path.resolve(__dirname, 'src/client/modules'),
      shared_path: path.resolve(__dirname, 'src/shared/'),
      assets_path: path.resolve(__dirname, 'src/client/assets/'),
    },
  },
  devServer: {
    port: WDS_PORT,
    contentBase: "./",
    historyApiFallback: true,
    inline: true,
		hot: true,
		noInfo: true,
		clientLogLevel: "error"
  }
}


if (process.env.NODE_ENV === 'production') {
  config.devtool = false;
  config.plugins = [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      THREE: "three",
      "window.THREE": "three",
      "window.$": "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    }),
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
} else {
	config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      THREE: "three",
      "window.THREE": "three",
      "window.$": "jquery",
      "window.jQuery": "jquery"
    })
  ]
}

module.exports = config
