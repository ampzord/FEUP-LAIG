/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;

    // IDs of child nodes.
    this.children = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    //Selectable field in LSX File
    this.selectable = false;

    //The animations ID
    this.animationsID = [];

    //The animation index
    this.animationIndice = 0;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

    // Animation Matrix
    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);

    // Animation Time
    this.animationTimer = 0;
    this.animationSect = 0; //Only useful to combo and linear
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

/**
 * Updates each node to their current animated matrix
 */

 /*
MyGraphNode.prototype.updateAnimation = function(deltaTime){
    this.animationTimer += deltaTime;

    if(this.animationIndice < this.animationsID.length){

        // Gets the current animation to be processed
        var currentAnimation = this.graph.animations[this.animationsID[this.animationIndice]];
        
        // Gets the animated matrix
        this.animationMatrix = currentAnimation.getAnimatedMatrix(this.animationTimer, this.animationSect);
        
        // Check if animation is over 
        if(this.animationTimer >= currentAnimation.getElapsedTime()){
           this.animationSect = 0;
           this.animationTimer = 0;
           this.animationIndice++; 
        }

        // Useful for linear and combo (to know which section to animate)
        else if(this.animationTimer >= currentAnimation.sectionTimes[this.animationSect]){
            this.animationIndice++;
        }
    }
}
*/

MyGraphNode.prototype.updateAnimation = function(deltaTime){
    this.animationTimer += deltaTime;
    if(this.animationIndice < this.animationsID.length){
        //gets animation being processed
        var currAnimation = this.graph.animations[this.animationsID[this.animationIndice]];
        
        //console.log("Time: " + this.animationTime);
        console.log("Section: " + this.animationSect);

        //gets currAnimation matrix
        this.animationMatrix = currAnimation.getAnimatedMatrix(this.animationTimer, this.animationSect);
        
        //finished processing current animation 
        if(this.animationTimer >= currAnimation.getElapsedTime()){
           this.animationSect = 0;
           this.animationTimer = 0;
           this.animationIndice++; 
        }

        //moving to next section of the current animation (useful for animation with multiple sections, such as linear and combo animations)
        else if(this.animationTimer >= currAnimation.sectionTimes[this.animationSect]){
            //this.animationTime = 0;
            this.animationSect++;
        }
    }
}

