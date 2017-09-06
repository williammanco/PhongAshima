// @flow

import React from 'react'
import { render } from 'react-dom'
import Canvas from './canvas'
import state from 'shared_path/state'

require('font-awesome/css/font-awesome.css')
require('./assets/sass/main.sass')

export default class App extends React.Component {
  componentWillMount(){
    console.log('%c |||| ', 'background: #222; color: #fff; padding: 10px 0px; font-weight: bold; line-height: 50px')
    this.events()
  }
  componentDidMount(){
    this.canvas.init()
    this.update()
  }
  events(){
    let self = this
    $(window).on({
      'resize' : function(){
        self.canvas.resize()
      }
    })
  }
  update() {
    this.canvas.update()
    requestAnimationFrame( this.update.bind(this) )
  }
  render() {
    return (
      <div>
        <Canvas onRef={ref => (this.canvas = ref)}/>
        <div id="text-content">
          <div className="description">
            <p>Ashima noise with Phong/Blinn shading, RIM, Fresnel and other customisations</p>
            <a href="https://github.com/williammanco/PhongAshima" target="_blank">source-code wip</a>
          </div>
        </div>
        <div id="social">
          <a href="https://twitter.com/williammanco" target="_blank"><i className="fa fa-twitter"></i></a>
          <a href="https://www.linkedin.com/in/william-manco-a7aa4315/" target="_blank"><i className="fa fa-linkedin"></i></a>
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
