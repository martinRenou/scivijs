//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let Slice = require("../src/BlockUtils/PlugIns/Slice");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('Slice', function(){
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new Slice(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it("should set X=0 as default slice equation", function(){
    assert.equal(myBlock.sliceNormal[0], 1);
    assert.equal(myBlock.sliceNormal[1], 0);
    assert.equal(myBlock.sliceNormal[2], 0);

    assert.equal(myBlock.slicePosition, 0);
  })

  it("should set new slice normal and normalize it", function(){
    myBlock.sliceNormal = [0.5, 0.256, -5];

    var norm = Math.sqrt(
      Math.pow(0.5, 2) + Math.pow(0.256, 2) + Math.pow(-5, 2)
    );

    var aNorm = 0.5/norm;
    var bNorm = 0.256/norm;
    var cNorm = -5/norm;

    assert.equal(myBlock.sliceNormal[0], aNorm);

    assert.equal(myBlock.sliceNormal[1], bNorm);

    assert.equal(myBlock.sliceNormal[2], cNorm);

  })

  it("should set new slice position", function(){
    let randomPos = Math.random() * (6464 + 5151515) -5151515;

    myBlock.slicePosition = randomPos;

    assert.equal(myBlock.slicePosition, randomPos);
  })

  it("should remove any other meshes", function(){
    assert.equal(myBlock._meshes.length, 1);
  })

  it("should change mesh-data", function(){
    // It changes data description
    assert.notDeepEqual(myBlock.data, dataBlock.data);

    // It changes coordArray
    assert.notDeepEqual(myBlock.coordArray, dataBlock.coordArray);

    // It removes tetras
    assert.isUndefined(myBlock.tetraArray);

    // It changes facesArray
    assert.notDeepEqual(myBlock.facesArray, dataBlock.facesArray);
  })
})
