/**
 * MyTriangle
 * @constructor
 * @args coordinates of each vertex(x,y,z)
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);
  
	this.args = args.split(" ");
	for(let i = 0; i < this.args.length; i++){
			this.args.push(parseFloat(this.args[i]));
	}

  this.initBuffers(args);
 };

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

 MyTriangle.prototype.initBuffers = function(args) {

    this.vertices = new Array();
    this.indices = new Array();
    this.normals = new Array();

    this.vertices.push(this.args[0],this.args[1],this.args[2]);
    this.vertices.push(this.args[3],this.args[4],this.args[5]);
    this.vertices.push(this.args[6],this.args[7],this.args[8]);

    this.normals.push(0,1,0);
    this.normals.push(0,1,0);
    this.normals.push(0,1,0);

    this.indices.push(0, 1, 2);

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
