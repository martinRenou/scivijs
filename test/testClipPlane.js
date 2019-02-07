//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let ClipPlane = require("../src/BlockUtils/PlugIns/ClipPlane");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('ClipPlane', function(){
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new ClipPlane(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it("should set X=0 as default plane equation", function(){
    assert.instanceOf(myBlock._planeNormalNode, THREE.Vector3Node);

    assert.equal(myBlock._planeNormalNode.x, 1);
    assert.equal(myBlock._planeNormalNode.y, 0);
    assert.equal(myBlock._planeNormalNode.z, 0);

    assert.equal(myBlock.planeNormal[0], 1);
    assert.equal(myBlock.planeNormal[1], 0);
    assert.equal(myBlock.planeNormal[2], 0);

    assert.equal(myBlock._planePositionNode.value, 0);

    assert.equal(myBlock.planePosition, 0);
  })

  it("should set new plane normal and normalize it", function(){
    myBlock.planeNormal = [0.5, 0.256, -5];

    var norm = Math.sqrt(
      Math.pow(0.5, 2) + Math.pow(0.256, 2) + Math.pow(-5, 2)
    );

    var aNorm = 0.5/norm;
    var bNorm = 0.256/norm;
    var cNorm = -5/norm;

    assert.equal(myBlock.planeNormal[0], aNorm);
    assert.equal(myBlock._planeNormalNode.x, aNorm);

    assert.equal(myBlock.planeNormal[1], bNorm);
    assert.equal(myBlock._planeNormalNode.y, bNorm);

    assert.equal(myBlock.planeNormal[2], cNorm);
    assert.equal(myBlock._planeNormalNode.z, cNorm);

  })

  it("should set new plane position", function(){
    let randomPos = Math.random() * (6464 + 5151515) -5151515;

    myBlock.planePosition = randomPos;

    assert.equal(myBlock.planePosition, randomPos);
    assert.equal(myBlock._planePositionNode.value, randomPos);
  })

  it("should add an alpha node only for clipped meshes (not for the \
computed slice)", function(){
    assert.equal(myBlock._meshes[0].material._alphaNodes.length, 1);
    assert.equal(myBlock._meshes[1].material._alphaNodes.length, 0);
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
})
