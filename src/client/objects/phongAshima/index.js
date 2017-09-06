
import { Object3D, Mesh, Vector2, IcosahedronBufferGeometry, ShaderMaterial } from 'three'
import ControlKit from 'controlkit'
import state from 'shared_path/state'
const shaderVertex = require('./main.vert')
const shaderFragment = require('./main.frag')

export default class PhongAshima extends Object3D {
  constructor(props) {
    super()
    const self = this
    self.props = props

    if(!this.props)
      this.props = {
        geometry : [25, 6],
        uniforms : {
          time: { value: 1.0 },
          speed: { value: 3.0 },
          elevation: { value: 6.1 },
          amplitude: { value: 3.0 },
          lightPos : { value: [0.0,-0.3,1.1]},
          fresnelExponent : { value: 0.34},
          fresnelCoef : { value: -0.98},
          rimColor : {value: [0.34,0.27,0.14]},
          rimStart : {value: 0.0},
          rimEnd :  {value: 10.0},
          rimCoef : {value: 5.0},
          ambientColor:  {value: [0.3, 0.1, 0.1]},
          diffuseColor:  {value: [0.5, 0.5, 0.5]},
          specularColor:  {value: [0.1, 0.1, 0.1]},
          specularExponent: {value: 4.0},
          noiseValue : {value: 0.09},
          backgroundColor : {value: [17,17,17]},
        }
      }
      this.ready()
  }
  controls(){
    const self = this

    let controlPad = {
      lightPos: [0,-0.3],
    }
    let controlSliderZ = {
      lightPosZ: 1.1,
      rangeLightPos: [0,5],
      rangeViewDir: [-3,3],
    }
    let controlSliderValue = {
      noiseValue: 0.09,
      amplitude: 1.0,
      elevation: 1.0,
      speed: 3.0,
      fresnelExponent: 0.34,
      fresnelCoef: -0.98,
      rimColor : [0.34,0.27,0.14],
      rimStart : 0.0,
      rimEnd :  10.0,
      rimCoef : 5.0,
      ambientColor: [0.3, 0.1, 0.1],
      diffuseColor: [0.5,0.5,0.5],
      specularColor: [0.1,0.1,0.1],
      specularExponent: 4.0,
      range: [-1,2],
      rangeSpecularExponent: [1,30],
      rangeRim: [0,10],
      rangeMin: [-1,1],
      rangeElevation: [0,10],
      rangeAmplitude: [0,10],
      rangeSpeed: [0,5],
      rangeMinZero: [0,1],
      rangeMax: [-100,100],
      backgroundColor: [17,17,17],
    }

    const controlKit = new ControlKit()

    controlKit
    .addPanel()
    .addPad(controlPad,'lightPos',{
      onChange:function(){
        self.material.uniforms.lightPos.value[0] = -controlPad.lightPos[0]
        self.material.uniforms.lightPos.value[1] = -controlPad.lightPos[1]
      }
    })
    .addSlider(controlSliderZ,'lightPosZ','rangeLightPos',{
      onChange:function(){
        self.material.uniforms.lightPos.value[2] = controlSliderZ.lightPosZ
      }
    })
    .addSlider(controlSliderValue,'noiseValue','rangeMinZero',{
      onChange:function(){
        self.material.uniforms.noiseValue.value = controlSliderValue.noiseValue
      }
    })
    .addSlider(controlSliderValue,'elevation','rangeElevation',{
      onChange:function(){
        self.material.uniforms.elevation.value = controlSliderValue.elevation
      }
    })
    .addSlider(controlSliderValue,'amplitude','rangeAmplitude',{
      onChange:function(){
        self.material.uniforms.amplitude.value = controlSliderValue.amplitude
      }
    })
    .addSlider(controlSliderValue,'speed','rangeSpeed',{
      onChange:function(){
        self.material.uniforms.speed.value = controlSliderValue.speed
      }
    })
    .addSlider(controlSliderValue,'fresnelExponent','rangeMin',{
      onChange:function(){
        self.material.uniforms.fresnelExponent.value = controlSliderValue.fresnelExponent
      }
    })
    .addSlider(controlSliderValue,'fresnelCoef','rangeMin',{
      onChange:function(){
        self.material.uniforms.fresnelCoef.value = controlSliderValue.fresnelCoef
      }
    })
    .addColor(controlSliderValue,'rimColor',{
      onChange:function(){
        self.material.uniforms.rimColor.value = controlSliderValue.rimColor
      },
      colorMode:'rgbfv',
    })
    .addSlider(controlSliderValue,'rimStart','rangeRim',{
      onChange:function(){
        self.material.uniforms.rimStart.value = controlSliderValue.rimStart
      }
    })
    .addSlider(controlSliderValue,'rimEnd','rangeRim',{
      onChange:function(){
        self.material.uniforms.rimEnd.value = controlSliderValue.rimEnd
      }
    })
    .addSlider(controlSliderValue,'rimCoef','rangeRim',{
      onChange:function(){
        self.material.uniforms.rimCoef.value = controlSliderValue.rimCoef
      }
    })
    .addColor(controlSliderValue,'ambientColor',{
      onChange:function(){
        self.material.uniforms.ambientColor.value = controlSliderValue.ambientColor
      },
      colorMode:'rgbfv',
    })
    .addColor(controlSliderValue,'diffuseColor',{
      onChange:function(){
        self.material.uniforms.diffuseColor.value = controlSliderValue.diffuseColor
      },
      colorMode:'rgbfv',
    })
    .addColor(controlSliderValue,'specularColor',{
      onChange:function(){
        self.material.uniforms.specularColor.value = controlSliderValue.specularColor
      },
      colorMode:'rgbfv',
    })
    .addSlider(controlSliderValue,'specularExponent','rangeSpecularExponent',{
      onChange:function(){
        self.material.uniforms.specularExponent.value = controlSliderValue.specularExponent
      }
    })
    .addColor(controlSliderValue,'backgroundColor',{
      onChange:function(){
        self.material.uniforms.backgroundColor.value = controlSliderValue.backgroundColor
        state.bg = controlSliderValue.backgroundColor
        $('body').css('background-color', `rgb(${state.bg[0]},${state.bg[1]},${state.bg[2]})`)
      },
      colorMode:'rgb',
    })

  }
  ready(){
    const self = this
    this.isReady = true

    this.geometry = new IcosahedronBufferGeometry(...self.props.geometry)
    this.material = new ShaderMaterial( {
      uniforms: self.props.uniforms,
      vertexShader: shaderVertex,
      fragmentShader: shaderFragment,
      wireframe: false
    })
    this.mesh = new Mesh( this.geometry, this.material )
    this.add(this.mesh)
    self.controls()
  }
  update(delta){
    if(!this.isReady)
      return false
    this.material.uniforms.time.value += 1

  }
}
