//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let PlugInBlock = require("../src/BlockUtils/PlugInBlock");

let Warp = require("../src/BlockUtils/PlugIns/Warp");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('Warp', function() {
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new Warp(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it('setInputNode specification', function() {
    assert.throws(() => {
        myBlock.inputData = 'my scalar data';
      },
      'Warp block needs a 3 dimension(s) input but your input is [data]');

    // ['data', 0, 0] will be used as input
    myBlock.setInput('my scalar data', ['data', 0, 0]);
    assert.deepEqual(myBlock.inputComponents, ['data', 0, 0]);
    assert.instanceOf(myBlock._inputDataNode, THREE.JoinNode);
    assert.isUndefined(myBlock._inputDataNode.w);
    

    // ['VX', 'VY', 'VZ'] will be used as input
    myBlock.inputData = 'my vector data';
    assert.deepEqual(myBlock.inputComponents, ['VX', 'VY', 'VZ']);
    assert.instanceOf(myBlock._inputDataNode, THREE.JoinNode);
    assert.isUndefined(myBlock._inputDataNode.w);
  });

  it('warp factor', function() {
    assert.equal(myBlock._warpFactor, 1);
    assert.instanceOf(myBlock._warpFactorNode, THREE.FloatNode);
    assert.equal(myBlock._warpFactorNode.number, 1);

    myBlock.warpFactor = 500;
    assert.equal(myBlock._warpFactor, 500);
    assert.equal(myBlock._warpFactorNode.number, 500);
  });

  it("should add a transform node", function(){
    assert.equal(myBlock._meshes[0].material._transformNodes.length, 1);
  })

  it("should not change mesh-data", function(){
    // Same data description
    assert.deepEqual(myBlock.data, dataBlock.data);

    // Same coordArray
    assert.deepEqual(myBlock.coordArray, dataBlock.coordArray);

    // Same tetras
    assert.deepEqual(myBlock.tetraArray, dataBlock.tetraArray);

    // Same facesArray
    assert.deepEqual(myBlock.facesArray, dataBlock.facesArray);
  })
});
