/**
 * MyCylinder
 * @constructor
 * @args height, bottom radius, top radius, sections along height(stacks) and parts per section(slices)
 */
function MyCylinder(scene, args) {
    CGFobject.call(this, scene);

    args = args.split(" ");
    this.scene = scene;
    this.height = parseFloat(args[0]);
    this.botRad = parseFloat(args[1]);
    this.topRad = parseFloat(args[2]);
    this.stacks = parseFloat(args[3]);
    this.slices = parseFloat(args[4]);
    this.top = parseFloat(args[5]);
    this.bottom = parseFloat(args[6]);

   if (this.top == 1 && this.bottom == 1) 
   {
        this.circle = new MyCylinderTopBottom(this.scene,this.slices, this.botRad, this.topRad);
    }
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

    if (this.top == 1 && this.bottom == 1)
    {
        //CGFobject.prototype.display.call(this);
        this.circle.display();
        /*this.scene.rotate(Math.PI,1,0,0);
        this.scene.translate(0,0,-1);
        this.circle.display();*/
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};;