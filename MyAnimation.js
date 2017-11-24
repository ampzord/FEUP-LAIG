
class MyAnimation {
    constructor(scene, id, speed) {
        this.scene = scene;
        this.id = id;
        this.speed = speed;
        this.animationFinished = false;
        this.elapsedTime = 0;
        this.sectionTimes = [];
    }

    getElapsedTime() {
        return this.elapsedTime;
    }

}




