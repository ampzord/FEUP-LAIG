
class MyAnimation {
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.animationFinished = false;
        this.animationTotalTime = 0;
        this.sectionTimes = [];
    }

    getAnimationTotalTime() {
        return this.animationTotalTime;
    }

}




