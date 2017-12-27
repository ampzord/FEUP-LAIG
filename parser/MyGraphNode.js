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

    //Picking field in LSX File
    this.pickable = false;

    //Column Position (Prolog)
    this.column = null;

    //Line Position
    this.line = null;

    this.positionX = null;

    this.positionY = null;

    this.positionZ = null;

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

/**
 * Updates the position of the node (Prolog)
 * @param {*} newColumn 
 * @param {*} newLine 
 */
MyGraphNode.prototype.updateLineColumn = function (newColumn, newLine)
{
    this.column = newColumn;
    this.line = newLine;
}

/**
 * Updates the node position
 * @param {*} newX 
 * @param {*} newY 
 * @param {*} newZ 
 */
MyGraphNode.prototype.updatePositions = function (newX, newY, newZ)
{
    this.positionX = newX;
    this.positionY = newY;
    this.positionZ = newZ;
}

/**
 * Initially assigns the position to nodes
 */
MyGraphNode.prototype.assignInitialPositions = function ()
{
    this.positionX = this.transformMatrix[12];
    this.positionY = this.transformMatrix[13];
    this.positionZ = this.transformMatrix[14];

    switch (this.nodeID)
    {
        case "piece1":
            this.column = "'A'";
            this.line = 1.
            break;

        case "piece2":
            this.column = "'B'";
            this.line = 1.
            break;
        
        case "piece3":
            this.column = "'C'";
            this.line = 1.
            break;

        case "piece4":
            this.column = "'D'";
            this.line = 1.
            break;
        
        case "piece5":
            this.column = "'E'";
            this.line = 1.
            break;

        case "piece6":
            this.column = "'F'";
            this.line = 1.
            break;

        case "piece7":
            this.column = "'G'";
            this.line = 1.
            break;
        
        case "piece8":
            this.column = "'H'";
            this.line = 1.
            break;

        case "piece9":
            this.column = "'A'";
            this.line = 2.
            break;

        case "piece10":
            this.column = "'B'";
            this.line = 2.
            break;

        case "piece11":
            this.column = "'C'";
            this.line = 2.
            break;

        case "piece12":
            this.column = "'D'";
            this.line = 2.
            break;
            
        case "piece13":
            this.column = "'E'";
            this.line = 2.
            break;

        case "piece14":
            this.column = "'F'";
            this.line = 2.
            break;

        case "piece15":
            this.column = "'G'";
            this.line = 2.
            break;

        case "piece16":
            this.column = "'H'";
            this.line = 2.
            break;

        case "piece17":
            this.column = "'A'";
            this.line = 3.
            break;

        case "piece18":
            this.column = "'B'";
            this.line = 3.
            break;

        case "piece19":
            this.column = "'C'";
            this.line = 3.
            break;

        case "piece20":
            this.column = "'D'";
            this.line = 3.
            break;
            
        case "piece21":
            this.column = "'E'";
            this.line = 3.
            break;

        case "piece22":
            this.column = "'F'";
            this.line = 3.
            break;

        case "piece23":
            this.column = "'G'";
            this.line = 3.
            break;

        case "piece24":
            this.column = "'H'";
            this.line = 3.
            break;

        case "piece25":
            this.column = "'A'";
            this.line = 4.
            break;

        case "piece26":
            this.column = "'B'";
            this.line = 4.
            break;

        case "piece27":
            this.column = "'C'";
            this.line = 4.
            break;

        case "piece28":
            this.column = "'D'";
            this.line = 4.
            break;
            
        case "piece29":
            this.column = "'E'";
            this.line = 4.
            break;

        case "piece30":
            this.column = "'F'";
            this.line = 4.
            break;

        case "piece31":
            this.column = "'G'";
            this.line = 4.
            break;

        case "piece32":
            this.column = "'H'";
            this.line = 4.
            break;

        case "piece33":
            this.column = "'A'";
            this.line = 5.
            break;

        case "piece34":
            this.column = "'B'";
            this.line = 5.
            break;

        case "piece35":
            this.column = "'C'";
            this.line = 5.
            break;

        case "piece36":
            this.column = "'D'";
            this.line = 5.
            break;
            
        case "piece37":
            this.column = "'E'";
            this.line = 5.
            break;

        case "piece38":
            this.column = "'F'";
            this.line = 5.
            break;

        case "piece39":
            this.column = "'G'";
            this.line = 5.
            break;

        case "piece40":
            this.column = "'H'";
            this.line = 5.
            break;

        case "piece41":
            this.column = "'A'";
            this.line = 6.
            break;

        case "piece42":
            this.column = "'B'";
            this.line = 6.
            break;

        case "piece43":
            this.column = "'C'";
            this.line = 6.
            break;

        case "piece44":
            this.column = "'D'";
            this.line = 6.
            break;
            
        case "piece45":
            this.column = "'E'";
            this.line = 6.
            break;

        case "piece46":
            this.column = "'F'";
            this.line = 6.
            break;

        case "piece47":
            this.column = "'G'";
            this.line = 6.
            break;

        case "piece48":
            this.column = "'H'";
            this.line = 6.
            break;

        case "piece49":
            this.column = "'A'";
            this.line = 7.
            break;

        case "piece50":
            this.column = "'B'";
            this.line = 7.
            break;

        case "piece51":
            this.column = "'C'";
            this.line = 7.
            break;

        case "piece52":
            this.column = "'D'";
            this.line = 7.
            break;
            
        case "piece53":
            this.column = "'E'";
            this.line = 7.
            break;

        case "piece54":
            this.column = "'F'";
            this.line = 7.
            break;

        case "piece55":
            this.column = "'G'";
            this.line = 7.
            break;

        case "piece56":
            this.column = "'H'";
            this.line = 7.
            break;

        case "piece57":
            this.column = "'A'";
            this.line = 8.
            break;

        case "piece58":
            this.column = "'B'";
            this.line = 8.
            break;

        case "piece59":
            this.column = "'C'";
            this.line = 8.
            break;

        case "piece60":
            this.column = "'D'";
            this.line = 8.
            break;
            
        case "piece61":
            this.column = "'E'";
            this.line = 8.
            break;

        case "piece62":
            this.column = "'F'";
            this.line = 8.
            break;

        case "piece63":
            this.column = "'G'";
            this.line = 8.
            break;

        case "piece64":
            this.column = "'H'";
            this.line = 8.
            break;

        default:
            break;
    }
}

