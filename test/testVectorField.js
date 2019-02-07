//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let PlugInBlock = require("../src/BlockUtils/PlugInBlock");

let VectorField = require("../src/BlockUtils/PlugIns/VectorField");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('VectorField', function() {
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new VectorField(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it('_setInputComponentArrays specification', function() {
    assert.throws(() => {
        myBlock.inputData = 'my scalar data';
      },
      'VectorField block needs a 3 dimension(s) input but your input is [data]');

    // ['data', 0, 0] will be used as input
    myBlock.setInput('my scalar data', ['data', 0, 0]);
    assert.deepEqual(myBlock.inputComponents, ['data', 0, 0]);
    assert.deepEqual(myBlock._inputComponentArrays[0],
      myTetra.meshDescription.data['my scalar data'].data.array);

    // ['VX', 'VY', 'VZ'] will be used as input
    myBlock.inputData = 'my vector data';
    assert.deepEqual(myBlock.inputComponents, ['VX', 'VY', 'VZ']);
    assert.deepEqual(myBlock._inputComponentArrays[0],
      myTetra.meshDescription.data['my vector data'].VX.array);
    assert.deepEqual(myBlock._inputComponentArrays[1],
      myTetra.meshDescription.data['my vector data'].VY.array);
    assert.deepEqual(myBlock._inputComponentArrays[2],
      myTetra.meshDescription.data['my vector data'].VZ.array);
    assert.isUndefined(myBlock._inputComponentArrays[3]);
  });

  it('Distribution', function() {
    assert.throws(() => {
        myBlock.distribution  = 'dummy';
      },
      'Allowed values for VectorField distribution are "random" and "ordered" but you gave "dummy"');

    myBlock.distribution  = 'ordered';
    let orderedGeom = myBlock._vectorsBufferGeometry.clone();
    myBlock.distribution  = 'random';
    assert.notDeepEqual(myBlock._vectorsBufferGeometry, orderedGeom);
  });

  it('Mode', function() {
    assert.throws(() => {
        myBlock.mode  = 'dummy';
      },
      'Allowed values for VectorField mode are "surface" and "volume" but you gave "dummy"');

    myBlock.mode  = 'surface';
    myBlock.mode  = 'volume';
  });

  it('pcVectors', function() {
    assert.throws(() => {
        myBlock.pcVectors  = -136;
      },
      'pcVectors must be ranged in [0, 1] but you gave -136');

    assert.throws(() => {
        myBlock.pcVectors  = 123456;
      },
      'pcVectors must be ranged in [0, 1] but you gave 123456');

    myBlock.pcVectors  = 0.5;
    let halfGeom = myBlock._vectorsBufferGeometry.clone();
    myBlock.pcVectors  = 0.2;
    assert.notDeepEqual(myBlock._vectorsBufferGeometry, halfGeom);
  });

  it('lengthFactor', function() {
    myBlock.lengthFactor  = 0.5;
    let geom = myBlock._vectorsBufferGeometry.clone();
    myBlock.lengthFactor  = -136;
    assert.notDeepEqual(myBlock._vectorsBufferGeometry, geom);
  });

  it("should change mesh-data", function(){
    // Same data description
    assert.deepEqual(myBlock.data, dataBlock.data);

    // Same coordArray
    assert.deepEqual(myBlock.coordArray, dataBlock.coordArray);

    // It removes tetras
    assert.isUndefined(myBlock.tetraArray);

    // It removes facesArray
    assert.isUndefined(myBlock.facesArray);
  })
});
