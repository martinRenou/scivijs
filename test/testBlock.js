//require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");

let U = require('./testUtils');


let scene, myTetra, myBlock;

describe('Block Transformations', () => {
  beforeEach( () => {
    scene = new U.Scene();
    myTetra = new SciviJS.Mesh(U.tetra());
    myBlock = new DataBlock(scene, myTetra);
  });

  it('should compute/return attribute min and max values when needed',
    () => { return myBlock.process().then( () => {
        assert.equal(
          myBlock.getComponentMin('my vector data', 'VZ'), 0);

        assert.equal(
          myBlock.getComponentMax('my vector data', 'VX'), 1);

        assert.equal(
          myBlock.getComponentMax('my scalar data'), 3);
      })
    }
  )

  it('should compute/return magnitude min and max values when needed',
    () => { return myBlock.process().then( () => {
        assert.equal(
          myBlock.getComponentMax(
            'my vector data', 'Magnitude'), Math.sqrt(3));

        assert.equal(
          myBlock.getComponentMin(
            'my vector data', 'Magnitude'), 0);
      })
    }
  )

  it('should init translation', () => {
    assert.deepEqual(myBlock.position, [0., 0., 0.]);
  })

  it('should init rotation', () => {
    assert.deepEqual(myBlock.rotation, [0., 0., 0.]);
  })

  it('should init scale', () => {
    assert.deepEqual(myBlock.scale, [1., 1., 1.]);
  })

  it('should translate and compose translations', () => {
    myBlock.translate(1., 0., 0.);
    assert.deepEqual(myBlock.position, [1., 0., 0.]);
    myBlock.translate(0., 1., 0.);
    assert.deepEqual(myBlock.position, [1., 1., 0.]);
    myBlock.translate(-1., 1., 56.);
    assert.deepEqual(myBlock.position, [0., 2., 56.]);
  })

  it('should rotate and compose rotations', () => {
    myBlock.rotate(Math.PI, 0., 0.);
    assert.deepEqual(myBlock.rotation, [Math.PI, 0., 0.]);
    myBlock.rotate(0., Math.PI/2, 0.);
    assert.deepEqual(myBlock.rotation, [Math.PI, Math.PI/2, 0.]);
    myBlock.rotate(-Math.PI, 0., Math.PI/2);
    assert.deepEqual(myBlock.rotation, [0, Math.PI/2, Math.PI/2]);
  })

  it('should set translation', () => {
    myBlock.position = [326, 0.256, 789.12];
    assert.deepEqual(myBlock.position, [326, 0.256, 789.12]);
  })

  it('should set rotation', () => {
    myBlock.rotation = [852, 0.256, 741.12];
    assert.deepEqual(myBlock.rotation, [852, 0.256, 741.12]);
  })

  it('should set scale', () => {
    myBlock.scale = [0.2356, 0.256, 741.12];
    assert.deepEqual(myBlock.scale, [0.2356, 0.256, 741.12]);
  })

  it('should translate', () => {
    myBlock.translate(-10, 20, 800);
    assert.deepEqual(myBlock.position, [-10, 20, 800]);
  })

  it('should rotate', () => {
    myBlock.rotate(-852, -0.056, 741.12);
    assert.deepEqual(myBlock.rotation, [-852, -0.056, 741.12]);
  })

  it('should set display status', () => {
    return myBlock.process().then( () => {
      assert.isTrue(myBlock.visible);
      myBlock.visible = false;
      assert.isFalse(myBlock.visible);
      assert.isFalse(myBlock._meshes[0].visible);
    });
  })
})


describe('Block IsoColor', () => {

  beforeEach( () => {
    return myBlock.process();
  });
  
  it('should be initialized with false', () => {
    assert.isFalse(myBlock.colored);
    // Meshes are rendered gray with a simple THREE.ColorNode
    assert.instanceOf(
      myBlock._meshes[0].material.color, THREE.ColorNode);
  })

  it('should change colored status', () => {
    myBlock.colored = true;
    assert.isTrue(myBlock.colored);
    assert.instanceOf(
      myBlock._meshes[0].material.color, THREE.FunctionCallNode);
  })

  it("should initialize color map", () => {
    assert.equal(myBlock._colorMap, "rainbow");
  })

  it("should change color map", () => {
    myBlock.colorMap = "gray";
    assert.equal(myBlock._colorMap, "gray");
  })

  it("shouldn't change color map if it doesn't exist", () => {
    assert.throws(() => {myBlock.colorMap = "coucou";},
                  'Color map "coucou" does not exist');
  })

  it("should change color map bounds", () => {
    let min = myBlock._dataMin;
    let max = myBlock._dataMax;
    let value = (max + min)/2;
    myBlock.colorMapMin = value;
    assert.equal(myBlock._colorMapMin, value);

    myBlock.colorMapMin = myBlock._dataMin;
    myBlock.colorMapMax = value;
    assert.equal(myBlock._colorMapMax, value);
  })

  it("should not change color map bounds when out of bounds", () => {
    let max = myBlock._dataMax;
    let value = 5 * max * max;
    myBlock.colorMapMax = value;
    assert.equal(myBlock._colorMapMax, myBlock._dataMax);
  })
})
