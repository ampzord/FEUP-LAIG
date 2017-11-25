class MyLinearAnimation extends MyAnimation{
    constructor(scene, id, speed, controlPoints){
        super(scene, id, speed);
        this.controlPoints = controlPoints;
        this.animationMatrix = mat4.create();
        
        this.sectionValues = [];
        this.finalDistance = 0;
        for(var i = 0; i < this.controlPoints.length - 1; i++){
            var distance = Math.sqrt(
                                Math.pow(this.controlPoints[i+1][0] - this.controlPoints[i][0], 2)+
                                Math.pow(this.controlPoints[i+1][1] - this.controlPoints[i][1], 2)+
                                Math.pow(this.controlPoints[i+1][2] - this.controlPoints[i][2], 2));
            this.finalDistance += distance;
            this.sectionTimes.push(this.finalDistance/this.speed);

            var angCos = (this.controlPoints[i+1][0] - this.controlPoints[i][0])/distance;
            var angSin = (this.controlPoints[i+1][2] - this.controlPoints[i][2])/distance;
            var deltay = this.controlPoints[i+1][1] - this.controlPoints[i][1];

            if(deltay !== 0){
                deltay /= Math.abs(this.controlPoints[i+1][1] - this.controlPoints[i][1]);
            }

            var ang = Math.acos(angCos);

            var xVelocity = this.speed * angCos;
            var zVelocity = this.speed * angSin;
            var yVelocity = Math.sqrt(Math.pow(this.speed, 2) - Math.pow(xVelocity, 2) - Math.pow(zVelocity, 2))*deltay;

            this.sectionValues.push([xVelocity, yVelocity, zVelocity, ang]);
        }
        this.elapsedTime = this.finalDistance / this.speed;

    }

    getAnimatedMatrix(time, section){
       var sectionTime = time;
        
       if (section >= 1) {
           sectionTime -= this.sectionTimes[section - 1];
       }

       if(section < this.controlPoints.length - 1){

           console.log("sectiontime: " + sectionTime);

           var deltax = sectionTime * this.sectionValues[section][0];
           var deltay = sectionTime * this.sectionValues[section][1];
           var deltaz = sectionTime * this.sectionValues[section][2];

           console.log("deltas: " + [deltax, deltay, deltaz]);

           var sectionVector = [
                this.controlPoints[section+1][0]-this.controlPoints[section][0],
                this.controlPoints[section+1][1]-this.controlPoints[section][1],
                this.controlPoints[section+1][2]-this.controlPoints[section][2]
           ];

           mat4.identity(this.animationMatrix);
           mat4.translate(this.animationMatrix, this.animationMatrix, [deltax, deltay, deltaz]);
           mat4.translate(this.animationMatrix, this.animationMatrix, [this.controlPoints[section][0], this.controlPoints[section][1], this.controlPoints[section][2]]);
           mat4.rotate(this.animationMatrix, this.animationMatrix, Math.atan(-sectionVector[2], sectionVector[0]) + Math.PI/2, [0, 1, 0]);
       }
       else{
          this.animationFinished = true;
       }

       //console.log("matrix: " + this.animationMatrix);

       return this.animationMatrix;
    }
}










/*
class MyLinearAnimation extends MyAnimation{
	constructor(scene, id, speed, controlPoints){
	  super(scene, id, speed);

	  this.controlPoints = controlPoints;
  
	  this.initValues = new Array();
	  this.totalDistance = 0;
	  for (let i = 0; i < controlPoints.length-1; i++){
		let values = new Array();
		let dist = Math.sqrt(
		  (controlPoints[i+1][0] - controlPoints[i][0])*(controlPoints[i+1][0] - controlPoints[i][0]) +
		  (controlPoints[i+1][1] - controlPoints[i][1])*(controlPoints[i+1][1] - controlPoints[i][1]) +
		  (controlPoints[i+1][2] - controlPoints[i][2])*(controlPoints[i+1][2] - controlPoints[i][2]));
  
		this.totalDistance += dist;
		let cosAlfa = (controlPoints[i+1][0] - controlPoints[i][0])/dist;
		let senAlfa = (controlPoints[i+1][1] - controlPoints[i][1])/dist;
		let dz = controlPoints[i+1][2] - controlPoints[i][2];
		let alfa = Math.acos(cosAlfa);
		this.sectionTimes.push(dist/this.speed);
		values.push(speed * cosAlfa, speed * senAlfa, dz, alfa);
		this.initValues.push(values);
	  }
	  this.elapsedTime = this.totalDistance / speed;
	  this.transformMatrix = mat4.create();
	}
  
	 getAnimatedMatrix(time, section) {
	  let secTime = time;
	  for(let i = 0; i < section; i++)
		secTime -= this.sectionTimes[i];
  
  
	  mat4.identity(this.transformMatrix);
	  if(section < this.controlPoints.length - 1){
		let dx = secTime * this.initValues[section][0];
		let dy = secTime * this.initValues[section][1];
		let dz = secTime * this.initValues[section][2];
  
		mat4.identity(this.transformMatrix);
		mat4.translate(this.transformMatrix, this.transformMatrix, [dx, dy, dz]);
		mat4.translate(this.transformMatrix, this.transformMatrix,
		   [this.controlPoints[section][0],
		   this.controlPoints[section][1],
		   this.controlPoints[section][2]]);
  
		console.log("Section " + section);
		// console.log("a " + this.initValues[section][3]);
		mat4.rotate(this.transformMatrix, this.transformMatrix, Math.acos(this.initValues[section][3]), [0, 1, 0]);
	  }
	  else
		this.animationFinished = true;
  
	  return this.transformMatrix;
	}
  
  }
*/

/*
class MyLinearAnimation extends MyAnimation {
	constructor(scene, id, speed, controlPoints) {
		//args
		super(scene, id, speed);
		this.controlPoints = controlPoints;

		this.initValues = [];
		this.totalDist = 0;

		//check distance between the controlPoints
		var i;
		for(i = 1; i < controlPoints.length; i++) {
			console.log("Ponto " + i-1 + " : ",  controlPoints[i-1][0]);
			console.log("Ponto " + i + " : ", controlPoints[i][0]);

			let dist = vec3.dist(vec3.fromValues(controlPoints[i-1][0],controlPoints[i-1][1],controlPoints[i-1][2]),vec3.fromValues(controlPoints[i][0],controlPoints[i][1],controlPoints[i][2]));
			console.log('Distance : ');
			console.log(dist);
			totalDist += dist;
		
			let cosAlfa = (controlPoints[i][0] - controlPoints[i-1][0])/dist;
			let senAlfa = (controlPoints[i][1] - controlPoints[i-1][1])/dist;
			let dz = controlPoints[i][2] - controlPoints[i-1][2];
			let alfa = Math.acos(cosAlfa);
			this.sectionTimes.push(dist/this.speed);
			values.push(speed * cosAlfa, speed * senAlfa, dz, alfa);
			this.initValues.push(values);

		}

		this.elapsedTime = this.totalDist / this.speed;
		this.transformMatrix = mat4.create();

	}
}*/
	/*
	
	MyAnimation.call(this);

	//arguments
	this.scene = scene;
	this.speed = speed; //medida em unidades 3D por segundo
	this.controlPoints = controlPoints;

	// velocidade = distancia / segundo -> seg = distancia / velocidade
	
	this.dist = 0;
	this.timerFinished = 0;
	this.controlPointDist = [];
	this.controlPointTime = [];

	//check distance between the controlPoints
	var i;
	for(i = 1; i < controlPoints.length; i++) {
		console.log("Ponto " + i-1 + " : ",  controlPoints[i-1][0]);
		console.log("Ponto " + i + " : ", controlPoints[i][0]);

		this.dist += vec3.dist(vec3.fromValues(controlPoints[i-1][0],controlPoints[i-1][1],controlPoints[i-1][2]),vec3.fromValues(controlPoints[i][0],controlPoints[i][1],controlPoints[i][2]));
		console.log(this.dist);
		
		this.controlPointDist.push(this.dist);

		// delta t = distancia / velocidade
		// tempo de distancia entre cada troço
		this.timeBetweenControlPoints = this.dist / this.speed;
		this.controlPointTime.push(this.timeBetweenControlPoints);
	}

	this.elapsedTime = this.speed / this.dist;

	this.previousAngle = 0;
	this.previousAngle2 = 0;
	this.previousFactor = 0;
}

// <ANIMATION id="ss" speed="ff" type="linear">
// <controlpoint xx="ff" yy="ff" zz="ff /> <!-- repete conforme -->
// <controlpoint xx="ff" yy="ff" zz="ff /> <!-- seja necessário -->

MyLinearAnimation.prototype = Object.create(MyLinearAnimation.prototype);

MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.update = function(time) {

	//check if it's time to stop
	if (time > this.elapsedTime) {
		time = this.time;
		this.timerFinished = 1;
	}

	console.log("Timer Value : " + time);
	
	var currentDistance = this.speed * time;
	var i = 0;
	while (currentDistance > this.controlPointDist[i] && i < this.controlPointDist.length) {
		i++;
	}

	console.log('Value of i :' + i);

	var x = this.controlPoints[i+1][0] - this.controlPoints[i][0];
	var y = this.controlPoints[i+1][1] - this.controlPoints[i][1];
	var z = this.controlPoints[i+1][2] - this.controlPoints[i][2];

	var controlPointDist2;
	if (i == 0)
		controlPointDist2 = 0;
	else
		controlPointDist2 = this.controlPointDist[i-1];

	var factor = (currentDistance - controlPointDist2) / ( this.controlPointDist[i] - controlPointDist2);

	console.log('CurrentDistance:' + currentDistance);
	console.log('ControlPointDistance[' + i + ']: ' + this.controlPointDist[i]);
	console.log('X : ' + x);
	console.log('Y : ' + y);
	console.log('Z : ' + z);

	console.log('Factor : ' + factor);

	var factorX = (x * factor + this.controlPoints[i][0]);
	var factorY = (y * factor + this.controlPoints[i][1]);
	var factorZ = (z * factor + this.controlPoints[i][2]);

	var orientationAngle = Math.atan(z/x);
	console.log('Orientation Angle :' + orientationAngle);

	if (x < 0)
		orientationAngle += Math.PI;

	if (x == 0 && z == 0)
		orientationAngle = this.previousAngle;

	this.previousFactor = factor;
	this.previousAngle = orientationAngle;

	this.scene.translate(factorX,factorY,factorZ);
	this.scene.rotate(orientationAngle, 0, 1 ,0);

	console.log('DEBUG - Printing controlPoints');
	console.log(this.controlPoints[i][0], " ", this.controlPoints[i][1], " ", this.controlPoints[i][2]);

	console.log('DEBUG - Printing factors (x,y,z)');
	console.log('FactorX: ' + factorX + 'FactorY: ' + factorY + 'FactorZ: ' + factorZ);
}
*/






/*
class MyLinearAnimation extends MyAnimation {
	constructor(scene, id, speed, controlPoints) {
		//args
		super(scene, id, speed);
		this.controlPoints = controlPoints;

		this.initValues = [];
		this.totalDist = 0;

		//check distance between the controlPoints
		var i;
		for(i = 1; i < controlPoints.length; i++) {
			console.log("Ponto " + i-1 + " : ",  controlPoints[i-1][0]);
			console.log("Ponto " + i + " : ", controlPoints[i][0]);

			let dist = vec3.dist(vec3.fromValues(controlPoints[i-1][0],controlPoints[i-1][1],controlPoints[i-1][2]),vec3.fromValues(controlPoints[i][0],controlPoints[i][1],controlPoints[i][2]));
			console.log('Distance : ');
			console.log(dist);
			totalDist += dist;
		
			let cosAlfa = (controlPoints[i][0] - controlPoints[i-1][0])/dist;
			let senAlfa = (controlPoints[i][1] - controlPoints[i-1][1])/dist;
			let dz = controlPoints[i][2] - controlPoints[i-1][2];
			let alfa = Math.acos(cosAlfa);
			this.secTimes.push(dist/this.speed);
			values.push(speed * cosAlfa, speed * senAlfa, dz, alfa);
			this.initValues.push(values);

		}

		this.totalTime = this.totalDist / this.speed;
		this.transformMatrix = mat4.create();

	}
}*/
	/*
	
	MyAnimation.call(this);

	//arguments
	this.scene = scene;
	this.speed = speed; //medida em unidades 3D por segundo
	this.controlPoints = controlPoints;

	// velocidade = distancia / segundo -> seg = distancia / velocidade
	
	this.dist = 0;
	this.timerFinished = 0;
	this.controlPointDist = [];
	this.controlPointTime = [];

	//check distance between the controlPoints
	var i;
	for(i = 1; i < controlPoints.length; i++) {
		console.log("Ponto " + i-1 + " : ",  controlPoints[i-1][0]);
		console.log("Ponto " + i + " : ", controlPoints[i][0]);

		this.dist += vec3.dist(vec3.fromValues(controlPoints[i-1][0],controlPoints[i-1][1],controlPoints[i-1][2]),vec3.fromValues(controlPoints[i][0],controlPoints[i][1],controlPoints[i][2]));
		console.log(this.dist);
		
		this.controlPointDist.push(this.dist);

		// delta t = distancia / velocidade
		// tempo de distancia entre cada troço
		this.timeBetweenControlPoints = this.dist / this.speed;
		this.controlPointTime.push(this.timeBetweenControlPoints);
	}

	this.totalTime = this.speed / this.dist;

	this.previousAngle = 0;
	this.previousAngle2 = 0;
	this.previousFactor = 0;
}

// <ANIMATION id="ss" speed="ff" type="linear">
// <controlpoint xx="ff" yy="ff" zz="ff /> <!-- repete conforme -->
// <controlpoint xx="ff" yy="ff" zz="ff /> <!-- seja necessário -->

MyLinearAnimation.prototype = Object.create(MyLinearAnimation.prototype);

MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.update = function(time) {

	//check if it's time to stop
	if (time > this.TotalTime) {
		time = this.time;
		this.timerFinished = 1;
	}

	console.log("Timer Value : " + time);
	
	var currentDistance = this.speed * time;
	var i = 0;
	while (currentDistance > this.controlPointDist[i] && i < this.controlPointDist.length) {
		i++;
	}

	console.log('Value of i :' + i);

	var x = this.controlPoints[i+1][0] - this.controlPoints[i][0];
	var y = this.controlPoints[i+1][1] - this.controlPoints[i][1];
	var z = this.controlPoints[i+1][2] - this.controlPoints[i][2];

	var controlPointDist2;
	if (i == 0)
		controlPointDist2 = 0;
	else
		controlPointDist2 = this.controlPointDist[i-1];

	var factor = (currentDistance - controlPointDist2) / ( this.controlPointDist[i] - controlPointDist2);

	console.log('CurrentDistance:' + currentDistance);
	console.log('ControlPointDistance[' + i + ']: ' + this.controlPointDist[i]);
	console.log('X : ' + x);
	console.log('Y : ' + y);
	console.log('Z : ' + z);

	console.log('Factor : ' + factor);

	var factorX = (x * factor + this.controlPoints[i][0]);
	var factorY = (y * factor + this.controlPoints[i][1]);
	var factorZ = (z * factor + this.controlPoints[i][2]);

	var orientationAngle = Math.atan(z/x);
	console.log('Orientation Angle :' + orientationAngle);

	if (x < 0)
		orientationAngle += Math.PI;

	if (x == 0 && z == 0)
		orientationAngle = this.previousAngle;

	this.previousFactor = factor;
	this.previousAngle = orientationAngle;

	this.scene.translate(factorX,factorY,factorZ);
	this.scene.rotate(orientationAngle, 0, 1 ,0);

	console.log('DEBUG - Printing controlPoints');
	console.log(this.controlPoints[i][0], " ", this.controlPoints[i][1], " ", this.controlPoints[i][2]);

	console.log('DEBUG - Printing factors (x,y,z)');
	console.log('FactorX: ' + factorX + 'FactorY: ' + factorY + 'FactorZ: ' + factorZ);
}
*/
