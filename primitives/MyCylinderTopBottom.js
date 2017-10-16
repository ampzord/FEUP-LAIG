/*
function MyCylinderTopBottom(scene, slices, topRadius, bottomRadius) {
    CGFobject.call(this, scene);

    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.slices = slices;
    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for(let i = 0; i< this.slices; i++)
    {
        this.vertices.push(currRadius * Math.cos(j*stepAng), currRadius * Math.sin(j*stepAng),i*depth);
        this.normals.push(currRadius * Math.cos(j*stepAng), currRadius * Math.sin(j*stepAng), 0);
        this.texCoords.push(j*deltaS, i*deltaT);
        currRadius += radiusInc;
    }

   

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
*/


 function MyCylinderTopBottom(scene, slices, topRadius, bottomRadius) 
 {
    CGFobject.call(this,scene);

    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.slices = slices;

    console.log(this.bottomRadius);
    console.log('----------------');
    console.log(this.topRadius);
    console.log('----------------');
    console.log(this.slices);
    console.log('----------------');

    this.initBuffers();
 };
 
 MyCylinderTopBottom.prototype = Object.create(CGFobject.prototype);
 MyCylinderTopBottom.prototype.constructor = MyCylinderTopBottom;
 
 MyCylinderTopBottom.prototype.initBuffers = function()
 {
    this.vertices = [];
    //var inq=2*Math.PI/this.slices;
    var inq=Math.PI/this.slices;

    var ang=0.0;
    for(var i = 0; i < this.slices; i++)
    {
        this.vertices.push(Math.cos(ang),  Math.sin(ang), 0); //z a 1
        ang += inq;
    }
 
    //Indices
    this.indices=[];
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
 
 
 
this.texCoords = [];
   
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