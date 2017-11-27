class MyComboAnimation extends MyAnimation{
    constructor(scene, id, type, animationRefs) {
        
        //args
        super(scene, id);
        this.type = type;
        this.animationRefs = animationRefs;

        this.animationTimes = [];
        this.currAnimation = 0;
        this.animationMatrix = mat4.create();
        this.sectionsPassed = 0;

        this.getAllAnimationsTimes();
        
        this.animationTotalTime = this.animationTimes[this.animationTimes.length - 1];

    }

    getAllAnimationsTimes() {
        let aux_time = 0;
        let totalTime = 0;
        for(let i = 0; i < this.animationRefs.length; i++) {

            var animationRef = this.scene.graph.animations[this.animationRefs[i]];
            for(let j = 0; j < animationRef.sectionTimes.length - 1; j++){
                if (animationRef.sectionTimes.length > 1){
                    this.sectionTimes.push(aux_time + animationRef.sectionTimes[j]);
                }
            }

            let secTime = animationRef.sectionTimes[animationRef.sectionTimes.length - 1];
            aux_time += secTime;
            this.sectionTimes.push(aux_time);
        }

        for(let i = 0; i < this.animationRefs.length; i++) {
            animationRef = this.scene.graph.animations[this.animationRefs[i]];
            totalTime += animationRef.getAnimationTotalTime();
            this.animationTimes.push(totalTime);
        }
    }

    getAnimMatrix(sectionTime, section){

        // First animation
        if(this.currAnimation == 0) {
            var animation = this.scene.graph.animations[this.animationRefs[this.currAnimation]];

            // Go to next animation
            if(sectionTime >= this.animationTimes[this.currAnimation]) {
                this.sectionsPassed -= animation.sectionTimes.length;
                this.currAnimation++;
            }   
            else {
                this.animationMatrix = animation.getAnimMatrix(sectionTime, this.sectionsPassed);
            }
        }

        // 2 or more animations
        else if(this.currAnimation >= 1) {
            sectionTime -= this.animationTimes[this.currAnimation - 1];
            var animation = this.scene.graph.animations[this.animationRefs[this.currAnimation]];
            
            // Go to next animation
            if(sectionTime >= (this.animationTimes[this.currAnimation] - this.animationTimes[this.currAnimation-1])){
                this.sectionsPassed -= animation.sectionTimes.length;
                this.currAnimation++;
            }   
            else{
                this.animationMatrix = animation.getAnimMatrix(sectionTime, this.sectionsPassed);
            }

            // Check if it's last animation
            if(this.currAnimation > this.animationRefs.length - 1) {
                this.animationFinished = true;
            }
        }
        return this.animationMatrix;
    }
}



