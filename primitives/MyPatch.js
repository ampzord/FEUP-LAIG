/**
 * MyPatch
 */

 function MyPatch(scene, patchInfo, args) 
 {
    CGFobject.call(this,scene);
    args = args.split(" ");

    this.divU = args[0];
    this.divV = args[1];
    this.parseInfo(patchInfo);

    this.initBuffers();
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.initBuffers = function () {


    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyPatch.prototype.applyAf = function (afS,afT){};

MyPatch.prototype.parseInfo = function(patchInfo) 
{
    //console.log(patchInfo.children[0].children[0].attributes);
    var cPoints = new Array();

    for(let i = 0; i < patchInfo.children.length; i++)
    {
        this.vDegree = patchInfo.children[i].children.length;
        for(let j = 0; j < patchInfo.children[i].children.length; j++)
        {

            this.x = patchInfo.children[i].children[j].attributes[0].value;
            this.y = patchInfo.children[i].children[j].attributes[1].value;
            this.z = patchInfo.children[i].children[j].attributes[2].value;
            this.w = patchInfo.children[i].children[j].attributes[3].value;
        }
        console.log('patch');
        this.vDegree -= 1;
        console.log('ENDpatch');
    }


    var patchFirstChild = nodeSpecs[descendantsIndex].children[0].children;
    console.log(patchFirstChild);
    var patchSecondChild = [];

    for (var p = 0; p < patchFirstChild.length; p++) {
        var cLinePointsAux = nodeSpecs[descendantsIndex].children[0].children[p].children;
        var cLinePoints = [];

        for(var h = 0; h < cLinePointsAux.length; h++) {
            var patchPoints = [];

            var x = this.reader.getFloat(cLinePointsAux[h], 'xx');
            if (x == null)
                return "failed to retrieve CPOINT 'xx' argument";

            var y = this.reader.getFloat(cLinePointsAux[h], 'yy');
            if (y == null)
                return "failed to retrieve CPOINT 'yy' argument";

            var z = this.reader.getFloat(cLinePointsAux[h], 'zz');
            if (z == null)
                return "failed to retrieve CPOINT 'zz' argument";

            var w = this.reader.getFloat(cLinePointsAux[h], 'ww');
            if (w == null)
                return "failed to retrieve CPOINT 'ww' argument";

            patchPoints.push(x,y,z,w);

            cLinePoints.push(patchPoints);
            /*console.log('ADDDEEEEEEUSSS');
            console.log(x);
            console.log(y);
            console.log(z);
            console.log(w);
            console.log('ADDDEEEEEEUSSS');*/
        }

        patchSecondChild.push(cLinePoints);
        var vDegree = cLinePointsAux.length-1;
    }

    var uDegree = patchFirstChild.length-1;
    console.log(descendants[j]);

    var patchArgs = [args[0], args[1], uDegree, vDegree, patchSecondChild];

};