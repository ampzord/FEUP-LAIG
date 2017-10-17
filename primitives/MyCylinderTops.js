/**
* MyCylinderTops
* @constructor
*/
function MyCylinderTops(scene, radius, slices) {
    CGFobject.call(this,scene);

    this.radius = radius;
    this.slices = slices;

    this.initBuffers();
};

MyCylinderTops.prototype = Object.create(CGFobject.prototype);
MyCylinderTops.prototype.constructor = MyCylinderTops;

MyCylinderTops.prototype.initBuffers = function() 
{

    this.vertices = [];
    this.indices=[];
    this.texCoords = [];

    var inq=2*Math.PI/this.slices;
    var ang=0.0;
    for(var i = 0; i < this.slices; i++)
    {
        this.vertices.push(Math.cos(ang),  Math.sin(ang), 0); //z a 1
        ang += inq;
    }
 
    for(i=0;i<this.slices-1;i++)
    {  
        if(i==this.slices-2)
        {
            this.indices.push(0,this.slices-1,0);
        }
        else
        {
            this.indices.push(0, i+1, i+2);
 
        }
   
    }
   
    inq=2*Math.PI/this.slices;
    ang=0.0;

    for(var i = 0; i < this.slices; i++)
    {
        this.texCoords.push((Math.cos(ang)/2)+0.5,  (Math.sin(ang)/2)+0.5);
        ang += inq;
    }
 
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};