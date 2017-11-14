function MyCircularAnimation(scene, speed, center, radius, startAngle, rotAngle) {
	MyAnimation.call(this);

	//arguments
	this.scene = scene;
	this.speed = speed; //medida em unidades 3D por segundo
	this.center = center;
	this.radius = radius;
	this.startAngle = startAngle;
	this.rotAngle = rotAngle;

	//vel = rotAngle / tempo -> tempo = rotAngle/vel
	this.time = this.rotAngle / this.speed;

	this.timerFinished = 0;
}

/*
<ANIMATION id="ss" speed="ff" type="circular"
centerx="ff" centery="ff" centerz="ff"
radius="ff" startang="ff" rotang="ff"
/>
*/

Vec3.prototype.distance = function(v) {
  var dx = v.x - this.x;
  var dy = v.y - this.y;
  var dz = v.z - this.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

Vec3.prototype.create = function(x, y, z) {
  return new Vec3(x, y, z);
};

MyCircularAnimation.prototype = Object.create(MyCircularAnimation.prototype);

MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.move = function(time) {

	//check if it's time to stop
}

