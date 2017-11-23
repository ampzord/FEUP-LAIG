function MyLinearAnimation(scene, speed, controlPoints) {
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

		//delta t = distancia / velocidade
		this.timeBetweenControlPoints = this.dist/this.speed;
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

