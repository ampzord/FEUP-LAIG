/*
* MyTriangle
* @constructor
*/
function MyTriangle(scene, args) {
    CGFobject.call(this,scene);

    this.args = args;

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {

    var points = this.args;
    this.a = Math.sqrt(Math.pow(points[0] - points[6], 2) + Math.pow(points[1] - points[7], 2) + Math.pow(points[2] - points[8], 2));
    this.b = Math.sqrt(Math.pow(points[3] - points[0], 2) + Math.pow(points[4] - points[1], 2) + Math.pow(points[5] - points[2], 2));
    this.c = Math.sqrt(Math.pow(points[6] - points[3], 2) + Math.pow(points[7] - points[4], 2) + Math.pow(points[8] - points[5], 2));
    
    this.cos_a = Math.cos((- Math.pow(this.a, 2) + Math.pow(this.b, 2) + Math.pow(this.c, 2))/(2 * this.b * this.c));
    this.cos_b = Math.cos((Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2))/(2 * this.b * this.c));
    this.cos_c = Math.cos((Math.pow(this.a, 2) + Math.pow(this.b, 2) - Math.pow(this.c, 2))/(2 * this.b * this.c));
    this.sin_b = Math.sqrt(1 - Math.pow(this.cos_b, 2));

    this.vertices = new Array();
    this.indices = new Array();
    this.normals = new Array();
    this.texCoords = new Array();

    this.vertices.push(points[0],points[1],points[2]);
    this.vertices.push(points[3],points[4],points[5]);
    this.vertices.push(points[6],points[7],points[8]);

    this.indices.push(0,1,2);

    this.normals.push(0,1,0);
    this.normals.push(0,1,0);
    this.normals.push(0,1,0);

    this.texCoords.push(0,0);
    this.texCoords.push(0,1);
    this.texCoords.push(1,1);

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/*
* Applies amplification factors
*/
MyTriangle.prototype.applyAf = function(ampS, ampT){
    this.texCoords = [
            0, 1,
            this.c/ampS, 1,
            (this.c - this.a * this.cos_b)/ampS, (1 - this.a * this.sin_b)/(ampT)
        ];
    this.updateTexCoordsGLBuffers();
};