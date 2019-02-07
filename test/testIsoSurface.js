//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");
let PlugInBlock = require("../src/BlockUtils/PlugInBlock");

let IsoSurface = require("../src/BlockUtils/PlugIns/IsoSurface");

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('IsoSurface/ IsoSurfaceUtils', function() {
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    myBlock = new IsoSurface(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it('setInputNode specification', function() {
    assert.throws(() => {
        myBlock.inputData = 'my vector data';
      },
      'IsoSurface block needs a 1 dimension(s) input but your input is [VX,VY,VZ]');

    // ['VY'] will be used as input
    myBlock.setInput('my vector data', ['VY']);
    assert.deepEqual(myBlock.inputComponents, ['VY']);
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);

    // data will be used as input
    myBlock.inputData = 'my scalar data';
    assert.deepEqual(myBlock.inputComponents, ['data']);
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);
  });

  it('should compute one new skin triangle', function() {
    myBlock.setInput('my vector data', ['VY']);

    myBlock.value = 0.2;

    // Points order in the array depends on the triangle normal
    assert.deepEqual(
      myBlock._meshes[0].geometry.attributes.position.array,
      new Float32Array([
        -1, -0.6, -1,
        -0.6, -0.6, -0.6,
        -0.6, -0.6, -1
      ])
    );

    myBlock.value = 0.6;

    // Points order in the array depends on the triangle normal
    assert.deepEqual(
      myBlock._meshes[0].geometry.attributes.position.array,
      new Float32Array([
        -1, 0.2, -1,
        0.2, 0.2, 0.2,
        0.2, 0.2, -1
      ])
    );
  });

  it('should compute one new skin square (two triangles side by side)', function() {
    myBlock.setInput('my vector data', ['VX']);

    myBlock.value = 0.2;

    // Points order in the array depends on the triangle normal
    assert.deepEqual(
      myBlock._meshes[0].geometry.attributes.position.array,
      new Float32Array([
        -0.6, -0.6, -1,
        -0.6, 1, -1,
        -0.6, -0.6, -0.6,

        -0.6, -0.6, -0.6,
        -0.6, 1, -1,
        -0.6, 1, -0.6
      ])
    );

    myBlock.value = 0.6;

    // Points order in the array depends on the triangle normal
    assert.deepEqual(
      myBlock._meshes[0].geometry.attributes.position.array,
      new Float32Array([
        0.2, 0.2, -1,
        0.2, 1, -1,
        0.2, 0.2, 0.2,

        0.2, 0.2, 0.2,
        0.2, 1, -1,
        0.2, 1, 0.2
      ])
    );
  });

  it("should change mesh-data", function(){
    // Change data description
    assert.notDeepEqual(myBlock.data, dataBlock.data);

    // Change coordArray
    assert.notDeepEqual(myBlock.coordArray, dataBlock.coordArray);

    // Remove tetras
    assert.isUndefined(myBlock.tetraArray);

    // Change facesArray
    assert.notDeepEqual(myBlock.facesArray, dataBlock.facesArray);
  })
});
