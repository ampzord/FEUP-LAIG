class MyLinearAnimation extends MyAnimation{
    constructor(scene, id, type, speed, controlPoints){

		//args
		super(scene, id);
		this.type = type;
        this.speed = speed;
		this.controlPoints = controlPoints;
		
        this.animationMatrix = mat4.create();
        this.sectionValues = [];
		this.finalDistance = 0;

		this.getSectionValues();

        this.animationTotalTime = this.finalDistance / this.speed;

	}
	
	getSectionValues() {
        for(let i = 0; i < this.controlPoints.length - 1; i++) {
			
			let distance = Math.sqrt(Math.pow(this.controlPoints[i+1][0] - this.controlPoints[i][0], 2) + Math.pow(this.controlPoints[i+1][1] - this.controlPoints[i][1], 2) +
						   Math.pow(this.controlPoints[i+1][2] - this.controlPoints[i][2], 2));
									 
            this.finalDistance += distance;
            this.sectionTimes.push(this.finalDistance / this.speed);

            var angleCos = (this.controlPoints[i+1][0] - this.controlPoints[i][0]) / distance;
            var angleSin = (this.controlPoints[i+1][2] - this.controlPoints[i][2]) / distance;
            var delta_y = this.controlPoints[i+1][1] - this.controlPoints[i][1];

            if(delta_y !== 0){
                delta_y /= Math.abs(this.controlPoints[i+1][1] - this.controlPoints[i][1]);
            }

            var xSpeed = this.speed * angleCos;
            var zSpeed = this.speed * angleSin;
			var ySpeed = Math.sqrt(Math.pow(this.speed, 2) - Math.pow(xSpeed, 2) - Math.pow(zSpeed, 2)) * delta_y;
			
			var angle = Math.acos(angleCos);

            this.sectionValues.push([xSpeed, ySpeed, zSpeed, angle]);
        }
	}

    getAnimMatrix(sectionTime, section){
	   
	   // Removes time of the previous section
       if (section >= 1) {
           sectionTime -= this.sectionTimes[section - 1];
       }

       if (section < this.controlPoints.length - 1) {

           var delta_x = sectionTime * this.sectionValues[section][0];
           var delta_y = sectionTime * this.sectionValues[section][1];
           var delta_z = sectionTime * this.sectionValues[section][2];

           var sectionVec = [
                this.controlPoints[section+1][0] - this.controlPoints[section][0],
                this.controlPoints[section+1][1] - this.controlPoints[section][1],
                this.controlPoints[section+1][2] - this.controlPoints[section][2]
		   ];
		   
		   var newAngle = Math.atan(-sectionVec[2], sectionVec[0]) + Math.PI/2;
		   //var newAngle = Math.atan(-sectionVec[2], sectionVec[0]);

           mat4.identity(this.animationMatrix);
           mat4.translate(this.animationMatrix, this.animationMatrix, [delta_x, delta_y, delta_z]);
           mat4.translate(this.animationMatrix, this.animationMatrix, [this.controlPoints[section][0], this.controlPoints[section][1], this.controlPoints[section][2]]);
           mat4.rotate(this.animationMatrix, this.animationMatrix, newAngle, [0, 1, 0]);
       }
       else {
          this.animationFinished = true;
       }

       return this.animationMatrix;
    }
}

