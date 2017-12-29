class MyPieceAnimation extends MyAnimation{
  constructor(scene, id, type, speed, controlPoints){
    
}

MyPieceAnimation.prototype = new MyAnimation();
MyPieceAnimation.prototype.constructor = MyPieceAnimation;

MyPieceAnimation.prototype.isComplete = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  return timePassed > this.timeSpan;
};

MyPieceAnimation.prototype.update = function(currentTime){
  var timePassed = (currentTime - this.initialTime)/1000;

  this.matrix = mat4.create();

  if(timePassed >= this.timeSpan){
    if(!this.nextAnimation)
      this.piece.moving = false;
    this.piece.animation = this.nextAnimation;
    return;
  }

  var movementRatio = 1 - timePassed/this.timeSpan;

  mat4.translate(this.matrix, this.matrix, [this.deltaX*movementRatio, 0, this.deltaZ*movementRatio]);
};

MyPieceAnimation.prototype.apply = function(){
  this.piece.scene.multMatrix(this.matrix);
};
