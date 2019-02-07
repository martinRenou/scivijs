//require('source-map-support').install();
let chai = require("chai");
let assert = chai.assert;

let SciviJS = require('../src/SciviJS');

let U = require('./testUtils');


let myTetra;

describe('Mesh', () => {
  it('Should return an error when mesh is not loaded',
    () => {
      myTetra = new SciviJS.Mesh(U.tetra());
      assert.throws(() => { let arrs = myTetra.getArrays(); },
          'Mesh must be loaded before getArrays method call');
    }
  )

  it('Should return an error when mesh has no vertices',
    () => {
      noVerticesMesh = new SciviJS.Mesh(U.noVerticesMesh());
      assert.throws(() => { noVerticesMesh._load(); },
          'No vertices specified');
    }
  )

  it('Should return an error when mesh has no faces',
    () => {
      noFacesMesh = new SciviJS.Mesh(U.noFacesMesh());
      assert.throws(() => { noFacesMesh._load(); },
          'No faces specified');
    }
  )

  it('Should return an error when there\'s no mesh data',
    () => {
      noDataMesh = new SciviJS.Mesh(U.noDataMesh());
      assert.throws(() => { noDataMesh._load(); },
          'No data specified');
    }
  )

  it('Should return an error when mesh data is not well formed',
    () => {
      notWellFormedDataMesh = new SciviJS.Mesh(U.notWellFormedDataMesh());
      assert.throws(() => { notWellFormedDataMesh._load(); },
          'Component \'data\' of data \'my scalar data\' can\'t be loaded, you must specify a path or a typed array');
    }
  )
})
