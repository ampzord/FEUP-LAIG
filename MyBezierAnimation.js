function MyBezierAnimation(scene, speed, controlPoints) {
	MyAnimation.call(this);

	//arguments
	this.scene = scene;
	this.speed = speed; //medida em unidades 3D por segundo
	this.controlPoints = controlPoints;

	//check distance between the controlPoints

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

MyBezierAnimation.prototype = Object.create(MyBezierAnimation.prototype);

MyBezierAnimation.prototype.constructor = MyBezierAnimation;

MyBezierAnimation.prototype.move = function(time) {

	//check if it's time to stop

		

}

