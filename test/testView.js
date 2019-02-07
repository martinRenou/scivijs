//require('source-map-support').install();
let chai = require("chai");
let assert = chai.assert;

let ViewUtils = require('../src/ViewUtils/View');
let View = ViewUtils.View;
let Mesh = ViewUtils.Mesh;

let U = require('./testUtils');


let scene, myTetra, myBlock;

describe('View', () => {
  beforeEach( () => {
    scene = new U.Scene();
    myTetra = new Mesh(U.tetra());
  });

  it('Should return an error if there\'s no mesh to display',
    () => {
      assert.throws(() => { myView = new View(U.DOMContainer()); },
          'Mesh is undefined, nothing to display');
    }
  )

  it('Should use a default BlockDescription if none is specified',
    () => {
      myView = new View(
        U.DOMContainer(),
        myTetra
      );
      assert.deepEqual(myView._blocksDescription,
        {main: {type: 'DataBlock'}});
    }
  )

  it("should use size of container as default", function(){
    let myView = new View(
      U.DOMContainer(),
      myTetra, undefined, {coucou : "heho"});
      assert.isUndefined(myView.fixedWidth);
      assert.isUndefined(myView.fixedHeight);
  })

  it("should use size defined in options", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {height : 600, width:400});
      assert.equal(myView.fixedWidth, 400);
      assert.equal(myView.fixedHeight, 600);
  })

  it("should use size defined in options(2)", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {height : 600});
      assert.isUndefined(myView.fixedWidth);
      assert.equal(myView.fixedHeight, 600);
  })

  it("should use size defined in options(3)", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {width : 600});
      assert.isUndefined(myView.fixedHeight);
      assert.equal(myView.fixedWidth, 600);
  })

  it("should update dimensions properly", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {height : 600, width:400});

    myView.update(myTetra, undefined, {height:36})
    assert.equal(myView.fixedWidth, 400);
    assert.equal(myView.fixedHeight, 36);
  })

  it("should update dimensions properly(2)", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {width:400});

    myView.update(myTetra, undefined, {height:36})

    assert.equal(myView.fixedWidth, 400);
    assert.equal(myView.fixedHeight, 36);
  })

  it("should update dimensions properly(3)", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {width:400});

    myView.update(myTetra, undefined, {width:36})

    assert.equal(myView.fixedWidth, 36);
    assert.isUndefined(myView.fixedHeight);
  })

  it("should update dimensions properly(4)", function(){
    let myView = new View(U.DOMContainer(), myTetra, undefined,
      {height : 600, width:400});

    myView.update(myTetra, undefined)

    assert.equal(myView.fixedWidth, 400);
    assert.equal(myView.fixedHeight, 600);
  })
})
