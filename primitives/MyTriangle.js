
/**
 * MyTriangle
 * @constructor
 * @args coordinates of each vertex(x,y,z)
 */
 function MyTriangle(scene, args) {
 	CGFobject.call(this,scene);
  
  	this.args = [];
	args = args.split(" ");
	for(let i = 0; i < args.length; i++){
			this.args.push(parseFloat(args[i]));
	}

  this.initBuffers(args);
 };

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

 MyTriangle.prototype.initBuffers = function(args) {

    this.vertices = new Array();
    this.indices = new Array();
    this.normals = new Array();
    this.baseTexCoords = new Array();

    this.vertices.push(this.args[0],this.args[1],this.args[2]);
    this.vertices.push(this.args[3],this.args[4],this.args[5]);
    this.vertices.push(this.args[6],this.args[7],this.args[8]);

    this.indices.push(0, 1, 2);

   	var vec1 = [
        this.args[0]-this.args[3],
        this.args[1]-this.args[4],
        this.args[2]-this.args[5]
    ];

    var vec2 = [
        this.args[0]-this.args[6],
        this.args[1]-this.args[7],
        this.args[2]-this.args[8]
    ];

    var normal = vec3.create();

    vec3.cross(normal,vec1,vec2);

    this.normals = [
        vec3[0],vec3[1],vec3[2],
        vec3[0],vec3[1],vec3[2],
        vec3[0],vec3[1],vec3[2]
    ];

    this.baseTexCoords.push(0,0);
    this.baseTexCoords.push(1,0);
    this.baseTexCoords.push(0,1);

    
	this.texCoords = new Array(this.baseTexCoords.length);

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTriangle.prototype.applyAf = function (afS,afT)
{
    for (var i = 0; i < this.baseTexCoords.length; i+=2) {
        this.texCoords[i] = this.baseTexCoords[i]/afS;
        this.texCoords[i+1] = this.baseTexCoords[i+1]/afT;
    }
    this.updateTexCoordsGLBuffers();
};