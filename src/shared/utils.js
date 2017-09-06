// @flow

/* eslint-disable no-console */

export default{

  getRandomMultiply(multiply){
    multiply == undefined ? multiply = 45 : null
    return Math.floor(Math.random()*11)*multiply
  },

  getRandomSign(){
    return Math.sign(Math.random() < 0.5 ? -1 : 1)
  },

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
},

  getDegreesToRadiant(degrees){
    return degrees * Math.PI / 180
  },

  getLoopInterval( number, min, max ){
    return Math.abs(Math.sin(number)) * (max - min) + min
  },

  getShuffleArray(array){
    var currentIndex = array.length, temporaryValue, randomIndex
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1;
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  },

  getBackgroundSize(container, input, type) {

      /*
       * Adapted from https://gist.github.com/ClickSimply/581823db9cdc8d94ed3f78c1a548f50d
       */

      var bgSize = container
      var sp = input
      var winratio = bgSize.x/bgSize.y
      var spratio = sp.x/sp.y
      var scale = 1
      var pos = new PIXI.Point(0,0)

      if(type == 'cover' ? (winratio > spratio) : (winratio < spratio)) {
          //photo is wider than background
          scale = bgSize.x/sp.x
          pos.y = -((sp.y*scale)-bgSize.y)/2
      } else {
          //photo is taller than background
          scale = bgSize.y/sp.y
          pos.x = -((sp.x*scale)-bgSize.x)/2
      }

      return {
          scale : scale,
          position : pos
      }
  }
}
