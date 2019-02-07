//require('source-map-support').install();
let chai = require("chai");
let assert = chai.assert;

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");

let U = require('./testUtils');

let scene, myTetra, dataBlock;

describe('DataBlock', function(){
  beforeEach(function() {
    scene = new U.Scene();
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock));
  });

  it('initBufferGeometry', function(){
    let coordArray = myTetra.meshDescription.vertices.array;
    let facesArray = myTetra.meshDescription.faces.array;

    assert.deepEqual(Array.prototype.slice.call(
      dataBlock._meshes[0].geometry.attributes.position.array),
      Array.prototype.slice.call(coordArray));
    assert.equal(
      dataBlock._meshes[0].geometry.attributes.position.itemSize, 3);

    assert.deepEqual(Array.prototype.slice.call(
      dataBlock._meshes[0].geometry.index.array),
      Array.prototype.slice.call(facesArray));
    assert.equal(dataBlock._meshes[0].geometry.index.itemSize, 1);
  })

  it('should create a mesh', function(){
    assert.instanceOf(dataBlock._meshes[0], THREE.Mesh);
  })
})
