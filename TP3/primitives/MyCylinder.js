/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, args) {
    CGFobject.call(this, scene);

    this.height = args[0];
    this.botRad = args[1];
    this.topRad = args[2];
    this.stacks = args[3];
    this.slices = args[4];

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

    var stepAng = 2 * Math.PI / this.slices;
    var currRadius = this.botRad;
    var radiusInc = (this.topRad - this.botRad)/this.stacks;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var deltaS = 1/this.slices;
	var deltaT = 1/this.stacks;

	var depth = this.height/this.stacks;

 	for (let i = 0; i <=this.stacks; i++){
		for (let j = 0; j <= this.slices; j++){
			this.vertices.push(currRadius * Math.cos(j*stepAng), currRadius * Math.sin(j*stepAng),i*depth);
			this.normals.push(currRadius * Math.cos(j*stepAng), currRadius * Math.sin(j*stepAng), 0);
			this.texCoords.push(j*deltaS, i*deltaT);

		}
        currRadius += radiusInc;
 	}

 	for(let i = 0; i < this.stacks; i++){
		for(let j = 0; j <= this.slices; j++){
			this.indices.push((i*this.slices)+j+i, (i*this.slices)+this.slices+j+1+i, i*(this.slices)+this.slices+j+i);
			this.indices.push((i*this.slices)+j+i, (i*this.slices)+j+1+i, i*(this.slices)+this.slices+j+1+i);
		}
 	}

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyCylinder.prototype.applyAf = function (afS,afT){};

