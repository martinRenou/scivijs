let PlugInBlock = require("../src/BlockUtils/PlugInBlock")

class Scene {

  constructor () {
    this.array = []
  }

  add(obj){
    this.array.push(obj)
  }

  remove (obj) {
    var obIndex = this.array.indexOf(obj)
    var temp = this.array.slice(0, obIndex)
    temp.concat(this.array.slice(obIndex + 1))
    this.array = temp
  }
}


class TestPlugInBlock extends PlugInBlock {
  _process () {}
  _updateMaterial() {}
}


let vX = new Float32Array([0, 0, 1, 1]);
let vY = new Float32Array([0, 1, 1, 1]);
let vZ = new Float32Array([0, 0.4, 1, 1]);
let data = new Float32Array([0, 1, 2, 3]);

function tetra () {
  return {
    name: 'tetra',
    vertices: {array: new Float32Array([-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, 1])},
    tetras: {array: new Uint32Array([0, 1, 2, 3])},
    faces: {array: new Uint32Array([0, 1, 2, 0, 2, 3, 1, 2, 3, 0, 1, 3])},
    data: {
      'my vector data': {
        'VX': {
          array: vX
        },
        'VY': {
          array: vY
        },
        'VZ': {
          array: vZ
        }
      },
      'my scalar data': {
        'data': {
          array: data
        }
      }
    }
  }
}

function noVerticesMesh () {
  return {
    name: 'tetra',
    tetras: {array: new Uint32Array([0, 1, 2, 3])},
    faces: {array: new Uint32Array([0, 1, 2, 0, 2, 3, 1, 2, 3, 0, 1, 3])},
    data: {
      'my scalar data': {
        'data': {
          array: data
        }
      }
    }
  }
}

function noFacesMesh () {
  return {
    name: 'tetra',
    vertices: {array: new Float32Array([-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, 1])},
    tetras: {array: new Uint32Array([0, 1, 2, 3])},
    data: {
      'my scalar data': {
        'data': {
          array: data
        }
      }
    }
  }
}

function notWellFormedDataMesh () {
  return {
    name: 'tetra',
    vertices: {array: new Float32Array([-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, 1])},
    tetras: {array: new Uint32Array([0, 1, 2, 3])},
    faces: {array: new Uint32Array([0, 1, 2, 0, 2, 3, 1, 2, 3, 0, 1, 3])},
    data: {
      'my scalar data': {
        'data': {}
      }
    }
  }
}

function noDataMesh () {
  return {
    name: 'tetra',
    vertices: {array: new Float32Array([-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, 1])},
    tetras: {array: new Uint32Array([0, 1, 2, 3])},
    faces: {array: new Uint32Array([0, 1, 2, 0, 2, 3, 1, 2, 3, 0, 1, 3])}
  }
}

function DOMContainer () {
  return document.createElement('div');
}

module.exports.Scene = Scene;
module.exports.tetra = tetra;
module.exports.TestPlugInBlock = TestPlugInBlock;
module.exports.noVerticesMesh = noVerticesMesh;
module.exports.noFacesMesh = noFacesMesh;
module.exports.notWellFormedDataMesh = notWellFormedDataMesh;
module.exports.noDataMesh = noDataMesh;
module.exports.DOMContainer = DOMContainer;
