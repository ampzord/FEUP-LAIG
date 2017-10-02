/**
 * MyCylinder
 * @constructor
 */

 function MyCylinder(scene, slices, stacks,s,t) 
 {
    CGFobject.call(this,scene);
   
    this.slices = slices;
    this.stacks = stacks;
    this.s = s;
    this.t = t;
 
    this.initBuffers(s,t);
 };
 
 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;
 
 MyCylinder.prototype.initBuffers = function(s,t) {
    
 
var degToRad = Math.PI / 180.0;
    var angulo = 0;
    var sizeOfPrism = 1;
    var stacksDim = sizeOfPrism/this.stacks;
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];
 
   var ytext = 0;
   var xtext = 0;
   this.patchLengthXText = this.s/this.slices;
   this.patchLengthYText = this.t/this.stacks;
   
//stacks e slices
var total = this.slices;
var aux = sizeOfPrism;
   
for (var i = 0; i<=this.stacks;i++)
{
        angulo = 0;
        xtext = 0;
        for (var k = 1; k<=this.slices;k++){
            var toNormal = angulo;

            this.vertices.push(Math.cos(angulo), Math.sin(angulo), aux);
            this.normals.push(Math.cos(angulo), Math.sin(angulo), 0); 
            this.texCoords.push(xtext,ytext);

            angulo += degToRad * (360/this.slices);
            xtext += this.patchLengthXText;

    //total é o numero de vertices
            total += 1;
        }
        aux -= stacksDim;
        ytext += this.patchLengthYText;
    }
 
 var last = 0;
 var next = last + this.slices;
for (var i = 1; i<=this.stacks;i++){
        for (var k = 1; k<=this.slices;k++){
               
            if(k != this.slices){  
            this.indices.push(last);
            this.indices.push(next);
            this.indices.push(next+1);
        
            this.indices.push(last);
            this.indices.push(next + 1);
            this.indices.push(last +1);}
            
            else {
                 this.indices.push(last);
            this.indices.push(next);
            this.indices.push(next+1 - this.slices);
        
            this.indices.push(next + 1 - this.slices);
            this.indices.push(last - this.slices +1);
            this.indices.push(last);
            }
            last++;
            next++;
        }
        aux -= stacksDim;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
 };