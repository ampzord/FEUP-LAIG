class MyPieceAnimation
{
  constructor(scene,nodeInit, nodeDest)
  {
    this.scene = scene;
		this.start = nodeInit;
		this.destination = nodeDest;

		this.timeSpan = 4;
		this.waitTime = 1;

		this.animationTime = 0;
		this.iteration = 0.02;

		this.xStart = this.start.positionX;
		this.yStart = this.start.positionZ;

		this.xFinish = this.destination.positionX;
		this.yFinish = this.destination.positionZ;

		this.radius = Math.sqrt(Math.pow((this.xFinish - this.xStart), 2) + Math.pow((this.yFinish - this.yStart), 2));
	}

	isComplete(currTime){
		return this.animationTime > (this.timeSpan - this.waitTime);
	}

	/*update(currTime){
		this.animationTime += currTime;
		//console.log(this.animationTime);
		if(elapsedTime < this.waitTime){
			return;
		}

		this.matrix = mat4.create();

		if(elapsedTime >= this.timeSpan){
			return;
		}

		var ratio = this.animationTime/(this.timeSpan - this.waitTime);
		if(ratio >= 1){
			this.piece.moving = false;
			return;
		}
		//console.log(ratio);

		var moveX = (this.xFinish - this.xStart) * ratio;
		var moveY = 0;
		var moveZ = (this.yFinish - this.yStart) * ratio;

		console.log("moveX = " + moveX);
		console.log("moveY = " + moveY);
		console.log("moveZ = " + moveZ);

		mat4.translate(this.matrix, this.matrix, [moveX, moveY, moveZ]);
		//console.log(this.matrix);
	}*/

	apply(){

		this.animationTime += this.iteration;

		//console.log(this.animationTime);

		var ratio = this.animationTime/(this.timeSpan - this.waitTime);
		if(ratio >= 1){
			this.start.moving = false;
			/*this.scene.game.unbindPieceToTile(this.start, piece);
 			this.scene.game.bindPieceToTile(this.destination, piece);*/
			return;
		}
		//var moveX = (this.xFinish - this.xStart) * ratio;
		var moveX = (this.xFinish - this.xStart) * ratio;
		var moveY = this.radius * 0.25 * Math.sin(Math.PI * (1 - ratio));
		var moveZ = (this.yStart - this.yFinish) * ratio;
		//var moveZ = (this.yFinish - this.yStart) * ratio;

		console.log("moveX = " + moveX);
		console.log("moveY = " + moveY);
		console.log("moveZ = " + moveZ);

		//this.scene.pushMatrix();
      //this.scene.translate(-this.xStart, moveY, -this.yStart);
      this.scene.translate(1, 1, 1);
      this.scene.rotate(Math.PI/16, 1, 0, 0);
	//	this.scene.popMatrix();
	}
}