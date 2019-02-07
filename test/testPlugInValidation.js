require('source-map-support').install();
let chai = require("chai")
let assert = chai.assert

let SciviJS = require('../src/SciviJS');
let DataBlock = require("../src/BlockUtils/DataBlock");

let IsoSurface = require("../src/BlockUtils/PlugIns/IsoSurface");
let ClipPlane = require("../src/BlockUtils/PlugIns/ClipPlane");
let Threshold = require("../src/BlockUtils/PlugIns/Threshold");
let Slice = require("../src/BlockUtils/PlugIns/Slice");
let Points = require("../src/BlockUtils/PlugIns/Points");
let VectorField = require("../src/BlockUtils/PlugIns/VectorField");
let Warp = require("../src/BlockUtils/PlugIns/Warp");

let U = require('./testUtils')

let scene, myTetra, dataBlock, ISBlock, CPBlock, TBlock,
  SBlock, PBlock, VFBlock, WBlock;

describe('PlugInBlocks validation', function() {
  // To fix timeout issues
  this.timeout(15000);

  beforeEach(function() {
    scene = new U.Scene()
    myTetra = new SciviJS.Mesh(U.tetra());
    dataBlock = new DataBlock(scene, myTetra);
    ISBlock = new IsoSurface(dataBlock);
    CPBlock = new ClipPlane(dataBlock);
    TBlock = new Threshold(dataBlock);
    SBlock = new Slice(dataBlock);
    PBlock = new Points(dataBlock);
    VFBlock = new VectorField(dataBlock);
    WBlock = new Warp(dataBlock);

    return dataBlock.loadData()
    .then(dataBlock.process.bind(dataBlock))
    .then(ISBlock.process.bind(ISBlock))
    .then(CPBlock.process.bind(CPBlock))
    .then(TBlock.process.bind(TBlock))
    .then(SBlock.process.bind(SBlock))
    .then(PBlock.process.bind(PBlock))
    .then(VFBlock.process.bind(VFBlock))
    .then(WBlock.process.bind(WBlock))
  });

  it('IsoSurface', function() {
    // After an IsoSurface Block
    assert.isFalse(IsoSurface.validate(ISBlock));

    // After a ClipPlane Block
    assert.isTrue(IsoSurface.validate(CPBlock));

    // After a Threshold Block
    assert.isTrue(IsoSurface.validate(TBlock));

    // After a Slice Block
    assert.isFalse(IsoSurface.validate(SBlock));

    // After a Points Block
    assert.isFalse(IsoSurface.validate(PBlock));

    // After a VectorField Block
    assert.isFalse(IsoSurface.validate(VFBlock));

    // After a Warp Block
    assert.isTrue(IsoSurface.validate(WBlock));
  });

  it('ClipPlane', function() {
    // After an IsoSurface Block
    assert.isTrue(ClipPlane.validate(ISBlock));

    // After a ClipPlane Block
    assert.isTrue(ClipPlane.validate(CPBlock));

    // After a Threshold Block
    assert.isTrue(ClipPlane.validate(TBlock));

    // After a Slice Block
    assert.isTrue(ClipPlane.validate(SBlock));

    // TODO: create a THREE.PointSizeNode in threejs to fix this test ?
    // After a Points Block
    // assert.isTrue(ClipPlane.validate(PBlock));

    // After a VectorField Block
    assert.isTrue(ClipPlane.validate(VFBlock));

    // After a Warp Block
    assert.isFalse(ClipPlane.validate(WBlock));
  });

  it('Slice', function() {
    // After an IsoSurface Block
    assert.isFalse(Slice.validate(ISBlock));

    // After a ClipPlane Block
    assert.isTrue(Slice.validate(CPBlock));

    // After a Threshold Block
    assert.isTrue(Slice.validate(TBlock));

    // After a Slice Block
    assert.isFalse(Slice.validate(SBlock));

    // TODO: create a THREE.PointSizeNode in threejs to fix this test ?
    // After a Points Block
    // assert.isFalse(Slice.validate(PBlock));

    // After a VectorField Block
    assert.isFalse(Slice.validate(VFBlock));

    // After a Warp Block
    assert.isFalse(Slice.validate(WBlock));
  });

  it('Points', function() {
    // After an IsoSurface Block
    assert.isTrue(Points.validate(ISBlock));

    // After a ClipPlane Block
    assert.isTrue(Points.validate(CPBlock));

    // After a Threshold Block
    assert.isTrue(Points.validate(TBlock));

    // After a Slice Block
    assert.isTrue(Points.validate(SBlock));

    // After a Points Block
    assert.isFalse(Points.validate(PBlock));

    // After a VectorField Block
    assert.isFalse(Points.validate(VFBlock));

    // After a Warp Block
    assert.isTrue(Points.validate(WBlock));
  });

  it('VectorField', function() {
    // After an IsoSurface Block
    assert.isTrue(VectorField.validate(ISBlock));

    // After a ClipPlane Block
    assert.isTrue(VectorField.validate(CPBlock));

    // After a Threshold Block
    assert.isTrue(VectorField.validate(TBlock));

    // After a Slice Block
    assert.isTrue(VectorField.validate(SBlock));

    // After a Points Block
    assert.isFalse(VectorField.validate(PBlock));

    // After a VectorField Block
    assert.isFalse(VectorField.validate(VFBlock));

    // After a Warp Block
    assert.isTrue(VectorField.validate(WBlock));
  });
});
