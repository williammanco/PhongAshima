// @flow
/* eslint no-console: "error" */

import React from 'react'
import { Scene, Math, WebGLRenderer, Clock, PerspectiveCamera, LoadingManager, TextureLoader } from 'three'
import settings from '../shared/settings.js'
import utils from 'shared_path/utils'
import state from 'shared_path/state'
import PhongAshima from './objects/phongAshima/'

THREE.OrbitControls = require('imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls.js')

export default class Canvas extends React.Component {
  constructor(props) {
    super()
    this.props = props
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer = new WebGLRenderer({ antialising: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(width, height)
    this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 30000 )
    this.camera.position.x = settings.camera.position.x
    this.camera.position.y = settings.camera.position.y
    this.camera.position.z = settings.camera.position.z

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement )
    this.controls.addEventListener( 'change', this.render )
    this.controls.enableZoom = false

    this.clock = new Clock()
    this.scene = new Scene()
    this.time = 0

    return false
  }
  componentWillMount(){
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  componentDidMount(){
    this.props.onRef(this)
    const self = this
    document.body.appendChild(this.renderer.domElement)

    this.loaderManager = new LoadingManager()
    self.ready()
    // this.textureParticleTree = new TextureLoader( this.loaderManager ).load( particleTree )

    this.events()
    this.loader()
  }
  loader(){
    const self = this

    this.loaderManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
    }
    this.loaderManager.onLoad = function ( ) {
    	self.ready()
    }
    this.loaderManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' )
    }
    this.loaderManager.onError = function ( url ) {
    	console.log( 'There was an error loading ' + url )
    }
  }
  ready(){
    const self = this

    /**
     * PhongAshima
     */
    this.phongAshima = new PhongAshima()
    this.scene.add(this.phongAshima)

    this.isReady = true
  }
  init(){
  }
  events(){
    const self = this
    $(window).on('resize', (e) => {
       self.resize()
    })
  }
  update() {
    if (!this.isReady) { return false }
    let delta = this.clock.getDelta()
    this.time += 1/60

    if(this.phongAshima)
      this.phongAshima.update(delta)

    this.renderer.render(this.scene, this.camera)
  }
  resize(){
  }
  render() {
    return false
  }
}
