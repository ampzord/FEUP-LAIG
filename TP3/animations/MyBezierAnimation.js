class MyBezierAnimation extends MyAnimation{
    constructor(scene, id, type, speed, controlPoints){

		//args
		super(scene, id);
		this.type = type;
        this.speed = speed;
		this.controlPoints = controlPoints;
		
        this.animationMatrix = mat4.create();

        this.cp1 = this.controlPoints[0];
        this.cp2 = this.controlPoints[1];
        this.cp3 = this.controlPoints[2];
        this.cp4 = this.controlPoints[3];

		this.totalDistance = this.calculateTotalDistance();

		this.animationTotalTime = this.totalDistance / this.speed;
		
		this.sectionValues = [];

        this.sectionTimes.push(this.animationTotalTime); //Useful for combo
	}
	
	calculateTotalDistance() {

		 // Calculating midway points of Bezier
		 var p12 = [(this.cp1[0] - this.cp2[0])/2, (this.cp1[1] - this.cp2[1])/2, (this.cp1[2] - this.cp2[2])/2];
		 var p23 = [(this.cp2[0] - this.cp3[0])/2, (this.cp2[1] - this.cp3[1])/2, (this.cp2[2] - this.cp3[2])/2];
		 var p34 = [(this.cp3[0] - this.cp4[0])/2, (this.cp3[1] - this.cp4[1])/2, (this.cp3[2] - this.cp4[2])/2];
 
		 var p123 = [(p12[0] - p23[0])/2, (p12[1] - p23[1])/2, (p12[2] - p23[2])/2];
		 var p234 = [(p23[0] - p34[0])/2, (p23[1] - p34[1])/2, (p23[2] - p34[2])/2];
 
		 var p1234 = [(p123[0] - p234[0])/2, (p123[1] - p234[1])/2, (p123[2] - p234[2])/2];
		 
		 // Getting totaldistance between the midway points
		 var totalDistance = this.getDistanceBetween2Points(this.cp1, p12) + this.getDistanceBetween2Points(p12, p123) + this.getDistanceBetween2Points(p123, p1234) 
		 					 + this.getDistanceBetween2Points(p1234, p234) + this.getDistanceBetween2Points(p234, p34) + this.getDistanceBetween2Points(p34, this.cp4);

		return totalDistance;
	}

    getDistanceBetween2Points(pt1, pt2){
        return Math.sqrt(Math.pow(pt2[0]-pt1[0], 2) + Math.pow(pt2[1]-pt1[1], 2) + Math.pow(pt2[2]-pt1[2], 2));
    }

    getAnimMatrix(time, section){
        let deltaTime = time / this.animationTotalTime;

        if(deltaTime <= 1) {
            var newX = Math.pow(1 - deltaTime, 3) * this.cp1[0] + 3 * deltaTime * Math.pow(1 - deltaTime, 2) * this.cp2[0]
                       + 3 * deltaTime * deltaTime * (1 - deltaTime) * this.cp3[0]
					   + deltaTime * deltaTime * deltaTime * this.cp4[0];
					
            var newY = Math.pow(1 - deltaTime, 3) * this.cp1[1] + 3 * deltaTime * Math.pow(1 - deltaTime, 2) * this.cp2[1]
                       + 3 * deltaTime * deltaTime * (1 - deltaTime) * this.cp3[1]
					   + deltaTime * deltaTime * deltaTime * this.cp4[1];
					   
            var newZ = Math.pow(1 - deltaTime, 3) * this.cp1[2] + 3 * deltaTime * Math.pow(1 - deltaTime, 2) * this.cp2[2]
                       + 3 * deltaTime * deltaTime * (1 - deltaTime) * this.cp3[2]
                       + deltaTime * deltaTime * deltaTime * this.cp4[2];
  
            var deltax = 3 * this.cp4[0] * deltaTime * deltaTime - 3 * this.cp3[0] * deltaTime * deltaTime + 6 * this.cp3[0] * (1 - deltaTime) * deltaTime
                 - 6 * this.cp2[0] * (1 - deltaTime) * deltaTime + 3 * this.cp2[0] * Math.pow(1 - deltaTime, 2) - 3 * this.cp1[0] * Math.pow(1 - deltaTime, 2);

            var deltaz = 3 * this.cp4[2] * deltaTime * deltaTime - 3 * this.cp3[2] * deltaTime * deltaTime + 6 * this.cp3[2] * (1 - deltaTime) * deltaTime
                 - 6 * this.cp2[2] * (1 - deltaTime) * deltaTime  + 3 * this.cp2[2] * Math.pow(1 - deltaTime, 2)  - 3 * this.cp1[2] * Math.pow(1 - deltaTime, 2);

			 let angle = Math.atan(-deltaz, deltax) + Math.PI/2;
             mat4.identity(this.animationMatrix);
             mat4.translate(this.animationMatrix, this.animationMatrix, [newX, newY, newZ]);
             mat4.rotate(this.animationMatrix, this.animationMatrix, angle, [0, 1, 0]);
        }
        else {
            this.animationFinished = true;
        }
        return this.animationMatrix;
    }
}