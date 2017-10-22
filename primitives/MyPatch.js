/**
 * MyPatch
 */
 function MyPatch(scene, patchInfo, args) 
 {
    CGFobject.call(this,scene);
    args = args.split(" ");

    this.divU = args[0];
    this.divV = args[1];
    this.vDegree = null;
    this.uDegree = null;
    this.controlpoints = new Array();
    this.parseInfo(patchInfo);
    this.surface = this.makeSurface();
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

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

MyPatch.prototype.getControlVertex = function()
{
    var resF = new Array();
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
    resF.push(res);
    console.log(resF);
    return resF;
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

MyPatch.prototype.makeSurface = function () 
{
    var knots1 = this.getKnotsVector(this.vDegree); // to be built inside webCGF in later versions ()
    var knots2 = this.getKnotsVector(this.uDegree); // to be built inside webCGF in later versions

    var nurbsSurface = new CGFnurbsSurface(this.vDegree, this.uDegree, knots1, knots2, this.getControlVertex());
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };
    CGFnurbsObject.call(this, this.scene, getSurfacePoint, this.divU, this.divV);
}

MyPatch.prototype.applyAf = function (afS,afT){};

