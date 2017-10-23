/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, args) 
{
	CGFobject.call(this,scene);

	this.args = args.split(" ");
	for(let i = 0; i < this.args.length; i++){
			this.args[i] = parseFloat(this.args[i]);
	}

	this.minS = 0;
	this.minT = 0;
	this.maxS = this.args[2] - this.args[0];
	this.maxT = this.args[1] - this.args[3];

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {

	this.vertices = [
            this.args[0], this.args[1], 0,
            this.args[0], this.args[3] ,0,
            this.args[2], this.args[3], 0,
            this.args[2], this.args[1], 0
			];

	this.indices = [
           0,1,2,
           2,3,0
        ];

    this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
    ];


   this.baseTexCoords = [
		this.minS, this.minT,
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.maxS, this.minT
	];

	this.texCoords = new Array(this.baseTexCoords.length);

	this.applyAf(1, 1);


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.applyAf = function (afS,afT)
{
	for (var i = 0; i < this.texCoords.length; i+=2) {
        this.texCoords[i] = this.baseTexCoords[i]/afS;
        this.texCoords[i+1] = this.baseTexCoords[i+1]/afT;
    }
    this.updateTexCoordsGLBuffers();
};