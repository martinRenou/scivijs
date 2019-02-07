//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let PlugInBlock = require("../src/BlockUtils/PlugInBlock");

let Points = require("../src/BlockUtils/PlugIns/Points");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('Points', function() {
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new Points(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it('Distribution', function() {
    assert.throws(() => {
        myBlock.distribution  = 'dummy';
      },
      'Allowed values for Points distribution are "random" and "ordered" but you gave "dummy"');

    myBlock.distribution  = 'ordered';
    let orderedGeom = myBlock._pointsBufferGeometry.clone();
    myBlock.distribution  = 'random';
    assert.notDeepEqual(myBlock._pointsBufferGeometry, orderedGeom);
  });

  it('Mode', function() {
    assert.throws(() => {
        myBlock.mode  = 'dummy';
      },
      'Allowed values for Points mode are "surface" and "volume" but you gave "dummy"');

    myBlock.mode  = 'surface';
    myBlock.mode  = 'volume';
  });

  it('pcPoints', function() {
    assert.throws(() => {
        myBlock.pcPoints  = -136;
      },
      'pcPoints must be ranged in [0, 1] but you gave -136');

    assert.throws(() => {
        myBlock.pcPoints  = 123456;
      },
      'pcPoints must be ranged in [0, 1] but you gave 123456');

    myBlock.pcPoints  = 0.5;
    let halfGeom = myBlock._pointsBufferGeometry.clone();
    myBlock.pcPoints  = 0.2;
    assert.notDeepEqual(myBlock._pointsBufferGeometry, halfGeom);
  });

  it('pointsSize', function() {
    assert.throws(() => {
        myBlock.pointsSize  = 'dummy';
      },
      'pointsSize must be of type "number" but given pointsSize is of type "string"');

    assert.throws(() => {
        myBlock.pointsSize  = -36;
      },
      'pointsSize must be positive number, be given pointsSize is "-36"');

    myBlock.pointsSize  = 0.5;
    assert.equal(myBlock._sizeNode.number, 0.5);
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
