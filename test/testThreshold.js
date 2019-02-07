//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let PlugInBlock = require("../src/BlockUtils/PlugInBlock");

let Threshold = require("../src/BlockUtils/PlugIns/Threshold");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('Threshold', function() {
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new Threshold(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it('setInputNode specification', function() {
    assert.throws(() => {
        myBlock.inputData = 'my vector data';
      },
      'Threshold block needs a 1 dimension(s) input but your input is [VX,VY,VZ]');

    // ['VY'] will be used as input
    myBlock.setInput('my vector data', ['VY']);
    assert.deepEqual(myBlock.inputComponents, ['VY']);
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);

    // data will be used as input
    myBlock.inputData = 'my scalar data';
    assert.deepEqual(myBlock.inputComponents, ['data']);
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);
  });

  it('lowerBound', function() {
    let value = 5*myBlock.upperBound*myBlock.upperBound + 5;
    assert.throws(
      () => {
        myBlock.lowerBound = value;
      }, 'lowerBound must be lower than upperBound, here upperBound is '
        +myBlock.upperBound+' while lowerBound is '+value);

    myBlock.lowerBound = -myBlock.upperBound*myBlock.upperBound;
    assert.equal(myBlock._lowerBoundNode.number,
      -myBlock.upperBound*myBlock.upperBound);
  });

  it('upperBound', function() {
    let value = -5*myBlock.lowerBound*myBlock.lowerBound - 5;
    assert.throws(
      () => {
        myBlock.upperBound = value;
      }, 'upperBound must be upper than lowerBound, here lowerBound is '
        +myBlock.lowerBound+' while upperBound is '+value);

    myBlock.lowerBound = -myBlock.upperBound*myBlock.upperBound;
    assert.equal(myBlock._lowerBoundNode.number,
      -myBlock.upperBound*myBlock.upperBound);
  });

  it('should create two iso-surfaces', function() {
    assert.equal(myBlock._meshes.length, 3);
  });

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
