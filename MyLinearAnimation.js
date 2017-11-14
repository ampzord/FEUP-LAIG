function MyLinearAnimation(scene, speed, controlPoints) {
	MyAnimation.call(this);

	//arguments
	this.scene = scene;
	this.speed = speed; //medida em unidades 3D por segundo
	this.controlPoints = controlPoints;

	//check distance between the controlPoints


	// velocidade = distancia / segundo -> seg = distancia / velocidade
	
	this.dist = 0;
	this.timerFinished = 0;
	this.controlPointDist = [];

	var i;
	for(i = 1; i < controlPoints.length; i++) {
		console.log("Ponto " + i-1 + " : ",  controlPoints[i-1][0]);
		console.log("Ponto " + i + " : ", controlPoints[i][0]);

		this.dist += vec3.dist(vec3.fromValues(points[i-1][0],points[i-1][1],points[i-1][2]),vec3.fromValues(points[i][0],points[i][1],points[i][2]));
		console.log(this.dist);
		
		this.controlPointDist.push(this.dist);
	}


	/*
	if (controlPoints.length == 1) {

	}*/
}

// <ANIMATION id="ss" speed="ff" type="linear">
// <controlpoint xx="ff" yy="ff" zz="ff /> <!-- repete conforme -->
// <controlpoint xx="ff" yy="ff" zz="ff /> <!-- seja necessário -->



Vec3.prototype.distance = function(v) {
  var dx = v.x - this.x;
  var dy = v.y - this.y;
  var dz = v.z - this.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

Vec3.prototype.create = function(x, y, z) {
  return new Vec3(x, y, z);
};

MyLinearAnimation.prototype = Object.create(MyLinearAnimation.prototype);

MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.move = function(time) {

	//check if it's time to stop

		

}

