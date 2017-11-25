/*
class BezierAnimation extends MyAnimation{
	constructor(scene, id, speed, controlPoints){
	  super(scene, id, speed);
		
	  this.controlPoints = controlPoints;

	  this.bezierPoints = [];
	  this.totalDistance = 0;

	  for(let i = 0; i < 4; i++)
		this.bezierPoints.push(vec3.fromValues(controlPoints[i][0], controlPoints[i][1], controlPoints[i][2]));
  
	  this.totalDistance = this.casteljau(1);
  
	  this.totalTime = this.totalDistance / speed;
	  this.transformMatrix = mat4.create();
	  this.time = 0;
	}
  */
	
	
		/*  let castelPoints = new Array();
	  for(let i = 0; i < nIterations; i++){
		for(let j = 0; j < 6*(i+1);j++){
		  castelPoints.splice(j+0, 0, bezierPoints[]);
		  castelPoints[j+0] =
		}
	  }*/
		
		/*casteljau(nIterations){

	  let p12 = vec3.create();
	  vec3.sub(p12, this.bezierPoints[1],this.bezierPoints[0]);
	  vec3.scale(p12, p12, 0.5);
  
	  let p23 = vec3.create();
	  vec3.sub(p23, this.bezierPoints[2],this.bezierPoints[1]);
	  vec3.scale(p23, p23, 0.5);
  
	  let p34 = vec3.create();
	  vec3.sub(p34, this.bezierPoints[3],this.bezierPoints[2]);
	  vec3.scale(p34, p34, 0.5);
  
	  let p123 = vec3.create();
	  vec3.sub(p123, p23, p12);
	  vec3.scale(p123, p123, 0.5);
  
	  let p234 = vec3.create();
	  vec3.sub(p234, p34, p23);
	  vec3.scale(p234, p123, 0.5);
  
	  let pM = vec3.create();
	  vec3.sub(p123, p234, p123);
	  vec3.scale(pM, pM, 0.5);
  
	  return vec3.distance(p12, this.bezierPoints[0]) +
			 vec3.distance(p12, p123) +
			 vec3.distance(p123, p234) +
			 vec3.distance(p234, p34) +
			 vec3.distance(p34, this.bezierPoints[3]);
	}
  
	 getAnimatedMatrix(time, section) {
	  mat4.identity(this.transformMatrix);
	  if(this.currentAnimation < this.controlPoints.length - 1){
		let dx = time * this.initValues[this.currentAnimation][0];
		let dy = time * this.initValues[this.currentAnimation][1];
  
		console.log("dx: "+ dx +  "-" + "CPx: " + this.controlPoints[this.currentAnimation+1][0]);
		console.log("idx " + this.currentAnimation);
		if (dx > this.controlPoints[this.currentAnimation+1][0] && dy > this.controlPoints[this.currentAnimation+1][1]) // currentAnimation has ended
		  this.currentAnimation++;
  
		mat4.identity(this.transformMatrix);
		mat4.translate(this.transformMatrix, this.transformMatrix, [dx, dy, 0]);
		mat4.translate(this.transformMatrix, this.transformMatrix,
		   [this.controlPoints[this.currentAnimation][0], this.controlPoints[this.currentAnimation][1], 0]);
  
		mat4.rotate(this.transformMatrix, this.transformMatrix, Math.acos(this.initValues[this.currentAnimation][2]), [0, 1, 0]);
		// this.transformMatrix.translate(this.controlPoints[this.currentAnimation][0],this.controlPoints[this.currentAnimation][1],0);
		// this.transformMatrix.rotate(Math.acos(this.initValues[this.currentAnimation][3]), 0, 1, 0);
	  }
	  else
		this.animationFinished = true;
  
	  return this.transformMatrix;
	}
  
  
  
	}*/
	
	function MyBezierAnimation(graph, animationSpeed, ctrlPoints) {
		Animation.call(this, graph);
	
		this.animationSpeed = animationSpeed;
		this.ctrlPoints = ctrlPoints;
	
		this.animationTime = 1000;
	
		this.p1 = ctrlPoints[0];
		this.p2 = ctrlPoints[1];
		this.p3 = ctrlPoints[2];
		this.p4 = ctrlPoints[3];
	
		this.length = this.getLength();
	
		this.animationTime = this.length/this.animationSpeed;
	};
	
	BezierAnimation.prototype = Object.create(Animation.prototype);
	BezierAnimation.prototype.constructor = BezierAnimation;
	
	BezierAnimation.prototype.getTransMatrix = function (elapsedTime) {
		let t = (elapsedTime / 1000) / this.animationTime;
		
	
		let x = Math.pow(1 - t, 3) * this.p1[0] 
			+ 3 * t * Math.pow(1 - t, 2) * this.p2[0]
			+ 3 * t * t * (1 - t) * this.p3[0]
			+ t * t * t * this.p4[0];
		let y = Math.pow(1 - t, 3) * this.p1[1] 
			+ 3 * t * Math.pow(1 - t, 2) * this.p2[1]
			+ 3 * t * t * (1 - t) * this.p3[1]
			+ t * t * t * this.p4[1];
		let z = Math.pow(1 - t, 3) * this.p1[2] 
			+ 3 * t * Math.pow(1 - t, 2) * this.p2[2]
			+ 3 * t * t * (1 - t) * this.p3[2]
			+ t * t * t * this.p4[2];
	
		let dx, dz;
		
		dx = 3 * this.p4[0] * t * t
			- 3 * this.p3[0] * t * t
			+ 6 * this.p3[0] * (1 - t) * t
			- 6 * this.p2[0] * (1 - t) * t
			+ 3 * this.p2[0] * Math.pow(1 - t, 2)
			- 3 * this.p1[0] * Math.pow(1 - t, 2);
	
		dz = 3 * this.p4[2] * t * t
			- 3 * this.p3[2] * t * t
			+ 6 * this.p3[2] * (1 - t) * t
			- 6 * this.p2[2] * (1 - t) * t
			+ 3 * this.p2[2] * Math.pow(1 - t, 2)
			- 3 * this.p1[2] * Math.pow(1 - t, 2);
	
	
		let phi = -Math.atan2(dz, dx);
	
		let coords = [x, y, z];
		let transMatrix = mat4.create();
		mat4.identity(transMatrix);
		mat4.translate(transMatrix, transMatrix, coords);
		mat4.rotate(transMatrix, transMatrix, phi, [0, 1, 0]);
	
		
	
	
		return transMatrix;
	
	}
	
	BezierAnimation.prototype.getLength = function() {
		let p12 = [(this.p1[0] + this.p2[0])/2, (this.p1[1] + this.p2[1])/2, (this.p1[2] + this.p2[2])/2];
		let p23 = [(this.p2[0] + this.p3[0])/2, (this.p2[1] + this.p3[1])/2, (this.p2[2] + this.p3[2])/2];
		let p34 = [(this.p3[0] + this.p4[0])/2, (this.p3[1] + this.p4[1])/2, (this.p3[2] + this.p4[2])/2];
	
		let p123 = [(p12[0] + p23[0])/2, (p12[1] + p23[1])/2, (p12[2] + p23[2])/2];
		let p234 = [(p23[0] + p34[0])/2, (p23[1] + p34[1])/2, (p23[2] + p34[2])/2];
	
		let p1234 = [(p123[0] + p234[0])/2, (p123[1] + p234[1])/2, (p123[2] + p234[2])/2];
	
		let length = this.calcDist(this.p1, p12) + this.calcDist(p12, p123) + this.calcDist(p123, p1234) + this.calcDist(p1234, p234) + this.calcDist(p234, p34) + this.calcDist(p34, this.p4);
	
		return length;
	}
	
	BezierAnimation.prototype.calcDist = function (Point1, Point2) {
		return Math.sqrt(Math.pow(Point2[0] - Point1[0], 2) + Math.pow(Point2[1] - Point1[1], 2) + Math.pow(Point2[2] - Point1[2], 2))
	}
	
	BezierAnimation.prototype.getAnimationTime = function () {
		return this.animationTime * 1000;
	}
	
	BezierAnimation.prototype.getType = function (){
		return "Bezier";
	}