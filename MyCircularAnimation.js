class MyCircularAnimation extends MyAnimation {
	constructor(scene, id, speed, center_x, center_y, center_z, radious, startAngle, rotationAngle) {
		super(scene, id, speed);
		this.center_x = center_x;
		this.center_y = center_y;
		this.center_z = center_z;
		this.radious = radious;
		this.startAngle = startAngle;
		this.rotationAngle = rotationAngle;

		//arc length
		this.distanceArc = this.radious * this.rotationAngle;
		 
		//animation time span
		this.elapsedTime = this.distanceArc / this.speed;

		//animation not started
		this.currentAngle = 0;
		this.deltaAngle = 0;

		//angular velocity
		this.angularVel = this.speed / this.radious;

		//animationMatrix
		this.animationMatrix = mat4.create();
	}
	
	getAnimatedMatrix(time, animationSection) {
		this.currentAngle += this.angularVel * time;

        if( this.currentAngle >= this.rotationAngle) {
            this.animationFinished = true;
        }
        else {
            mat4.identity(this.animationMatrix);
			var deltaAngle = this.startAngle + this.currentAngle;
			
			//Teorica
            mat4.translate(this.animationMatrix, this.animationMatrix, [this.center_x, this.center_y, this.center_z]);
            mat4.rotate(this.animationMatrix, this.animationMatrix, deltaAngle, [0, 1, 0]);
            mat4.translate(this.animationMatrix, this.animationMatrix, [this.radious, 0, 0]);
            mat4.rotate(this.animationMatrix, this.animationMatrix, Math.PI, [0, 1, 0]);
        }
        return this.animationMatrix;
    }
}

/*


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
*/
/*
<ANIMATION id="ss" speed="ff" type="circular"
centerx="ff" centery="ff" centerz="ff"
radius="ff" startang="ff" rotang="ff"
/>
*/

/*

MyCircularAnimation.prototype = Object.create(MyCircularAnimation.prototype);

MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.update = function(time) {

	//check if it's time to stop
	
}

*/