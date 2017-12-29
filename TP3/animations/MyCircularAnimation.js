class MyCircularAnimation extends MyAnimation{
    constructor(scene, id, type, speed, centerx, centery, centerz, radius, startAngle, rotAngle){
		
		//args
		super(scene, id);
		this.type = type;
        this.speed = speed;
        this.centerx = centerx;
        this.centery = centery;
        this.centerz = centerz;
        this.radius = radius;
        this.startAngle = startAngle;
        this.rotAngle = rotAngle;

        this.totalDistance = this.radius * this.rotAngle;
		this.animationTotalTime = this.totalDistance / this.speed;
		this.angularSpeed = this.speed / this.radius;
        this.currentAngle = 0;
        this.deltaAngle = 0;
        
		this.animationMatrix = mat4.create();
        this.sectionTimes.push(this.animationTotalTime); //Useful for combo
    }

    getAnimMatrix(time, section) {
        this.currentAngle = this.angularSpeed * time;
		
		if(this.currentAngle < this.rotAngle) {
			mat4.identity(this.animationMatrix);
            var deltaAngle = this.startAngle + this.currentAngle;
            mat4.translate(this.animationMatrix, this.animationMatrix, [this.centerx, this.centery, this.centerz]);
            mat4.rotate(this.animationMatrix, this.animationMatrix, deltaAngle, [0, 1, 0]);
            mat4.translate(this.animationMatrix, this.animationMatrix, [this.radius, 0, 0]);
            mat4.rotate(this.animationMatrix, this.animationMatrix, Math.PI, [0, 1, 0]);
        }
        else {
            this.animationFinished = true;
        }
        return this.animationMatrix;
    }
}
