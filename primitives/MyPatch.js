/**
 * MyPatch
 * @constructor
 */
 
 function MyPatch(scene, args) 
 {
    this.scene = scene;

    var uDivisions = args[0];
    var vDivisions = args[1];
    var uDegree = args[2];
    var vDegree = args[3];
    var controlPoints = args[4];

    var knots1 = this.getKnotsVector(uDegree);
    var knots2 = this.getKnotsVector(vDegree);

    this.nurbsSurface = new CGFnurbsSurface(uDegree, vDegree, knots1, knots2, controlPoints);
    CGFnurbsObject.call(this, this.scene, this.getSurfacePoint, uDivisions, vDivisions);
};

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getSurfacePoint = function(u, v) {
    return this.nurbsSurface.getPoint(u, v);
};

MyPatch.prototype.display = function(){
  CGFnurbsObject.prototype.display.call(this);
}

MyPatch.prototype.getKnotsVector = function(degree) 
{
    var v = new Array();
    for (var i=0; i<=degree; i++) {
        v.push(0);
    }
    for (var i=0; i<=degree; i++) {
        v.push(1);
    }
    return v;
}

MyPatch.prototype.applyAf = function (afS,afT){};



/*
function MyPatch(scene, divU, divV, controlvertexes) {
  CGFobject.call(this,scene);*/
 
  // this.divU = divU;
  // this.divV = divV;
 /*
  var degreeU = controlvertexes.length - 1;
  var degreeV = controlvertexes[0].length - 1;
  var knots1 = this.getKnotsVector(degreeU);\
  var knots2 = this.getKnotsVector(degreeV);
 
  var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, knots1, knots2, controlvertexes);
 *//*
  getSurfacePoint = function(u, v) {
  return nurbsSurface.getPoint(u, v);
};
 */
  //this.nurbsObject = new CGFnurbsObject(scene, getSurfacePoint, divU, divV);
 /*
};
 
MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;
 
MyPatch.prototype.getKnotsVector = function(degree) {
 
  var knotsAux = [];
  for (var i=0; i<=degree; i++) {
    knotsAux.push(0);
  }
  for (var i=0; i<=degree; i++) {
    knotsAux.push(1);
  }
 
  return knotsAux;
};
 
MyPatch.prototype.display = function() {
  //this.nurbsObject.display();
}
*/




/*
MyPatch.prototype.getControlVertex = function()
{
    //var resF = new Array();
    var res = new Array();
    for(var u = 0; u <= this.uDegree; u++)
    {   
        var controlVerts = new Array();
        for(var v = 0; v <= this.vDegree; v++)
        {
            var i = v + u * (this.vDegree + 1);
            controlVerts.push([this.controlpoints[i][0],this.controlpoints[i][1],this.controlpoints[i][2],1]);
        }
        res.push(controlVerts);
    }
    //resF.push(res);
    //console.log(resF);
    return res;
}*/
/*
MyPatch.prototype.parseInfo = function(patchInfo) 
{ 
    for(let i = 0; i < patchInfo.children.length; i++)
    {
        for(let j = 0; j < patchInfo.children[i].children.length; j++)
        {
            this.x = patchInfo.children[i].children[j].attributes[0].value;
            this.y = patchInfo.children[i].children[j].attributes[1].value;
            this.z = patchInfo.children[i].children[j].attributes[2].value;
            this.w = patchInfo.children[i].children[j].attributes[3].value;
            this.controlpoints.push([this.x, this.y, this.z, this.w]);
        }
        this.vDegree = patchInfo.children[i].children.length -1;
    }
    this.uDegree = patchInfo.children.length -1;
}
*/


/*
MyPatch.prototype.makeSurface = function (id, degree1, degree2, controltexes, translation) 
{
    var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
    var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions
    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, this.ctrlVer);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };
    var obj = new CGFnurbsObject(this, getSurfacePoint, 20, 20);
    this.surfaces.push(obj);
}
*/


//-----------------------------------------------------
/*
function MyPatch(graph, divU, divV, controlvertexes) {
  MyGraphLeaf.call(this, graph)
 
  // this.divU = divU;
  // this.divV = divV;
 
  var degreeU = controlvertexes.length - 1;
  var degreeV = controlvertexes[0].length - 1;
  var knots1 = this.getKnotsVector(degreeU);
  var knots2 = this.getKnotsVector(degreeV);
 
  var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, knots1, knots2, controlvertexes);
 
  getSurfacePoint = function(u, v) {
  	return nurbsSurface.getPoint(u, v);
  };
 
  this.nurbsObject = new CGFnurbsObject(graph.scene, getSurfacePoint, divU, divV);
};
 
MyPatch.prototype = Object.create(MyGraphLeaf.prototype);
MyPatch.prototype.constructor = MyPatch;
 */

 /**
 * MyPatch
 * @constructor
 */
 /*
 function MyPatch (scene, args) {
  this.scene = scene;
  
  var uDivs = args[0];
  var vDivs = args[1];
  var uDegree = args[2];
  var vDegree = args[3];
  var cPoints = args[4];

  var knots1 = this.getKnotsVector(uDegree);
  var knots2 = this.getKnotsVector(vDegree);

  console.log(cPoints);

  this.nurbsSurface = new CGFnurbsSurface(uDegree, vDegree, knots1, knots2, cPoints);

  CGFnurbsObject.call(this, this.scene, this.getSurfacePoint, uDivs, vDivs);
};



*/
/**
 * MyPatch
 * @constructor
 */

 /*
 function MyPatch (scene, args) {
  this.scene = scene;
  
  var uDivs = args[0];
  var vDivs = args[1];
  var uDegree = args[2];
  var vDegree = args[3];
  var cPoints = args[4];

  var knots1 = this.getKnotsVector(uDegree);
  var knots2 = this.getKnotsVector(vDegree);

  console.log(cPoints);

  this.nurbsSurface = new CGFnurbsSurface(uDegree, vDegree, knots1, knots2, cPoints);

  CGFnurbsObject.call(this, this.scene, this.getSurfacePoint, uDivs, vDivs);
};

MyPatch.prototype = Object.create(CGFnurbsObject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.getSurfacePoint = function(u, v) {
    return this.nurbsSurface.getPoint(u, v);
};

MyPatch.prototype.display = function(){
  CGFnurbsObject.prototype.display.call(this);
}

MyPatch.prototype.getKnotsVector = function(degree) {
  var v = new Array();
  for (var i=0; i<=degree; i++) {
    v.push(0);
  }
  for (var i=0; i<=degree; i++) {
    v.push(1);
  }
  return v;
};*/