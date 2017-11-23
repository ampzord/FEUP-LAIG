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


MyBezierAnimation.prototype = Object.create(MyBezierAnimation.prototype);

MyBezierAnimation.prototype.constructor = MyBezierAnimation;

MyBezierAnimation.prototype.update = function(time) {

	//check if it's time to stop

		

}

