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
    this.materialID = null;

    // The texture ID.
    this.textureID = null;

    //The animation ID
    this.animationsID = [];

    //Selectable field in LSX File
    this.selectable = false;

    // Transform Matrix
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

    // Animation Matrix
    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);

     // Animation Variables
     this.animationElapsedTime = 0;
     this.animationCurrentSection = 0;
     this.animationIndex = 0;
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
 * Applies the animations periodically through a deltatime
 */
MyGraphNode.prototype.applyAnimation = function(deltaTime) {

    this.animationElapsedTime = deltaTime + this.animationElapsedTime;

    if(this.animationIndex < this.animationsID.length) {
        
        var animation = this.graph.animations[this.animationsID[this.animationIndex]];
        this.animationMatrix = animation.getAnimMatrix(this.animationElapsedTime, this.animationCurrentSection);

        // Check if animation ended
        if(this.animationElapsedTime >= animation.getAnimationTotalTime()) {
            this.animationCurrentSection = 0;
            this.animationElapsedTime = 0;
            this.animationIndex++;
        }
        
        // Check if animation between sections ended (combo or linear)
        else if(this.animationElapsedTime >= animation.sectionTimes[this.animationCurrentSection]) {
            
            if(animation.type == "combo") {
               animation.sectionsPassed++;
            }
            this.animationCurrentSection++;
        }
    }
}

