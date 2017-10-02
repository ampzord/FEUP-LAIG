/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene,slices,s) 
 {
 	CGFobject.call(this,scene);

 	this.slices = slices;
 	this.s = s;
 	this.initBuffers(s);

  };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function(s) 
 {
 	this.vertices = [];
 	this.indices = [];
    this.normals = [];
    this.texCoords = [];
   
    var ang = 0;
    
    this.vertices.push(0,0,1);
    this.texCoords.push(0.5,0.5);
    this.normals.push(0,0,1);

    for (var i = 0; i < this.slices; i++)
    {
        this.vertices.push(Math.cos(ang), Math.sin(ang),1);
        this.texCoords.push( ((Math.sin(ang) + 1)*0.5) , ((Math.cos(ang) + 1) * 0.5) );
        this.normals.push(0,0,1);
        ang += (360/this.slices)*(Math.PI/180);

    }

    var x = 1;
    var y = 2;

    for (var i = 0; i < this.slices-1; i++)
    {
       this.indices.push(y,0,x);
        x++;
        y++;
    }

    
    
    this.indices.push(0,this.slices,1);
    this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };