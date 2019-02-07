//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock")

let U = require('./testUtils')

let scene, myTetra, dataBlock, myBlock;

describe('PlugInBlock', function() {
  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    dataBlock.translate(54, 12.2, 1.11111);
    dataBlock.rotation = [Math.PI/4, Math.PI/2, Math.PI/3];
    dataBlock.scale = [56, 32, 23];
    myBlock = new U.TestPlugInBlock(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(myBlock.process.bind(myBlock))
  });

  it('_setInputNode specification', function() {
    myBlock.inputData = 'my vector data';
    myBlock.inputComponents = ['VX', 'VZ'];
    assert.instanceOf(myBlock._inputDataNode, THREE.JoinNode);

    myBlock.inputData = 'my scalar data';
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);

    assert.throws(() => { myBlock.inputData = 'dummy'; },
    '"dummy" is not a known data');

    assert.throws(
      () => {
        myBlock.inputData = 'my scalar data';
        myBlock.inputComponents = [];
      }, 'inputComponents must contain at least one component or number');

    assert.throws(
      () => {
        myBlock.inputData = 'my scalar data';
        myBlock.inputComponents = ['coucou'];
      }, 'Component "coucou" of data "my scalar data" is not known');

    assert.throws(
      () => {
        myBlock.inputData = 'my vector data';
        myBlock.inputComponents = ['VX', 'VZ', 'VY', 'VX', 'VZ', 'VX'];
      }, 'Maximum vector size is 4');

    // We can use Magnitude as input node
    assert.throws(() => {
        myBlock.inputData  = 'my vector data';
        myBlock.inputComponents = ['Magnitude'];
      },
      'Support of Magnitude as input component is not implemented yet');
    /*myBlock.inputData  = 'my vector data';
    myBlock.inputComponents = ['Magnitude'];
    assert.instanceOf(myBlock._inputDataNode, THREE.Math1Node);

    assert.throws(() => {
        myBlock.inputData  = 'my scalar data';
        myBlock.inputComponents = ['Magnitude'];
      },
      'Component "Magnitude" of data "my scalar data" is not known');*/

    // It is possible to use Float values as input node
    myBlock.inputData = 'my vector data';
    myBlock.inputComponents = [0, 3.2, 'VX'];
    assert.instanceOf(myBlock._inputDataNode, THREE.JoinNode);
    assert.instanceOf(myBlock._inputDataNode.x, THREE.FloatNode);
    assert.equal(myBlock._inputDataNode.x.number, 0);
    assert.instanceOf(myBlock._inputDataNode.y, THREE.FloatNode);
    assert.equal(myBlock._inputDataNode.y.number, 3.2);
    assert.instanceOf(myBlock._inputDataNode.z, THREE.AttributeNode);
    assert.equal(myBlock.inputData, 'my vector data');
    assert.deepEqual(myBlock.inputComponents, [0, 3.2, 'VX']);
  });

  it('_setInputComponentArrays specification', function() {
    myBlock.inputData = 'my vector data';
    myBlock.inputComponents = ['VX', 'VZ'];
    assert.instanceOf(myBlock._inputComponentArrays[0], Float32Array);
    assert.instanceOf(myBlock._inputComponentArrays[1], Float32Array);

    myBlock.inputData = 'my scalar data';
    assert.equal(myBlock._inputComponentArrays.length, 1);
    assert.instanceOf(myBlock._inputComponentArrays[0], Float32Array);

    myBlock.inputData = 'my vector data';
    myBlock.inputComponents = [0, 3.2, 'VX'];
    assert.equal(myBlock._inputComponentArrays[0], 0);
    assert.equal(myBlock._inputComponentArrays[1], 3.2);
  });

  it('setter for inputData specification', function() {
    // First component of first data must be used as default
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);
    assert.equal(myBlock.inputData, 'my vector data');

    // Here it's only a scalar data so it's a THREE.AttributeNode
    myBlock.inputData = 'my scalar data';
    assert.instanceOf(myBlock._inputDataNode, THREE.AttributeNode);
    assert.equal(myBlock.inputData, 'my scalar data');
    assert.equal(myBlock.inputComponents, 'data');

    // All data components are used as input, here it's a vector so it's
    // a THREE.JoinNode
    myBlock.inputData = 'my vector data';
    assert.instanceOf(myBlock._inputDataNode, THREE.JoinNode);
    assert.equal(myBlock.inputData, 'my vector data');
    assert.deepEqual(myBlock.inputComponents, ['VX', 'VY', 'VZ']);

    assert.throws(() => { myBlock.inputData = 'dummy'; },
      '"dummy" is not a known data');
  });

  it('should inherit transformations', function(){
    assert.deepEqual(myBlock.position, [54, 12.2, 1.11111]);
    assert.deepEqual([myBlock._meshes[0].position.x, 
      myBlock._meshes[0].position.y, 
      myBlock._meshes[0].position.z]
      [54, 12.2, 1.11111]);
    assert.deepEqual(myBlock.rotation,
      [Math.PI/4, Math.PI/2, Math.PI/3]);
    assert.deepEqual(myBlock.scale, [56, 32, 23]);
  })

  it("shouldn't inherit materials", function(){
    assert.notStrictEqual(dataBlock._meshes[0].material, myBlock._meshes[0].material);
  })

  it('should inherit geometries', function(){
    assert.strictEqual(dataBlock._meshes[0].geometry, myBlock._meshes[0].geometry);
  })

  it("shouldn't inherit meshes", function(){
    assert.notStrictEqual(dataBlock._meshes[0], myBlock._meshes[0]);
  })
});
