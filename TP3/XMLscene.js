var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;

    this.lightValues = {};
    this.selectableNodes = "None";
    this.Type = 0;
    this.CameraChosen = 0;
    this.Difficulty = 0;
    this.TimeElapsed = 0;
    this.gameStarted = false;
    this.pauseGame = false;
    this.startingPlayer = 0;
    this.cameras = [];


    this.gameStatusOptions = {
        0: "Player 1 (Black) Playing",
        1: "Player 2 (White) Playing",
        2: "Player 1 (Black) Won",
        3: "Player 2 (White) Won",
        4: ""
    }

    this.gameStatus = this.gameStatusOptions['4'];

    this.firstPickedNode = null;
    this.secondPickedNode = null;

    var date = new Date();
    this.sceneInitTime = date.getTime();

    this.oldTimeElapsed = null;
    this.PlayerBlack_Score = 0;
    this.PlayerWhite_Score = 0;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.shader = new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag");
    this.shader.setUniformsValues({selectedRed: 0, selectedGreen: 1, selectedBlue: 0});
    this.updateScaleFactor();
    
    this.initCameras();
    this.startCams();

    this.enableTextures(true);
    
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
    this.axis = new CGFaxis(this);

    //Animations
    this.lastUpdateTime = 0;
    this.setUpdatePeriod(16); //desired delay between update periods - 60 frames

    this.game = new MyGameBoard(this);
    /*this.game.currentPlayer = this.startingPlayer + 1;
    this.game.gameType = this.type;
    this.game.difficulty = this.Difficulty;*/

    this.setPickEnabled(true);
}

XMLscene.prototype.updateCamera = function ()
{
    this.camera = this.cameras[this.CameraChosen];
}

XMLscene.prototype.animatePieces = function(node11, node22)
{
    var animationName = this.randomName();

    var node1 = this.graph.nodes[node11.nodeID];
    var node2 = this.graph.nodes[node22.nodeID];

    if (node1.piece == "'h'" || node1.piece == "'H'")
    {
        var horse = true;

        var controlPoints = [];
        controlPoints.push(new Array(this.graph.nodes[node1.nodeID].animationMatrix[12], 
            this.graph.nodes[node1.nodeID].animationMatrix[13], this.graph.nodes[node1.nodeID].animationMatrix[14]));
            

        if (node2.line == (node1.line+2) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)+1))
        {
            controlPoints.push(new Array(8.4, 0.0001, 16.8));
        }
        else if (node2.line == (node1.line+2) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)-1))
        {
            controlPoints.push(new Array(-8.4, 0.0001, 16.8));
        }
        else if (node2.line == (node1.line-2) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)-1))
        {
            controlPoints.push(new Array(-8.4, 0.0001, -16.8));
        }
        else if (node2.line == (node1.line-2) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)+1))
        {
            controlPoints.push(new Array(8.4, 0.0001, -16.8));
        }
        else if (node2.line == (node1.line-1) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)-2))
        {
            controlPoints.push(new Array(-16.8, 0.0001, -8.4));
        }
        else if (node2.line == (node1.line+1) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)-2))
        {
            controlPoints.push(new Array(-16.8, 0.0001, 8.4));
        }
        else if (node2.line == (node1.line+1) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)+2))
        {
            controlPoints.push(new Array(16.8, 0.0001, 8.4));
        }
        else if (node2.line == (node1.line-1) && node2.column.charCodeAt(1) == (node1.column.charCodeAt(1)+2))
        {
            controlPoints.push(new Array(16.8, 0.0001, -8.4));
        }

        var animation1 = new MyLinearAnimation(this, animationName, "linear", 8, controlPoints);
        this.graph.animations[animationName] = animation1;
        this.graph.nodes[node1.nodeID].animationsID.push(animationName);
        this.graph.nodes[node1.nodeID].animationElapsedTime = 0;

        this.graph.nodes[node1.nodeID].updateLineColumn(node2.column,node2.line);
        console.log('Depois de mover: ');
        console.log('Peca origem, Coluna: ' + this.graph.nodes[node1.nodeID].column + ' Linha: ' + this.graph.nodes[node1.nodeID].line + ' Peca: ' + this.graph.nodes[node1.nodeID].piece);
    }

    if (!horse)
    {
        var ctrl = -1;
        var increment = -1;
        console.log('DENTRO DA ANIÇACAO');
        console.log('Peca origem, Coluna: ' + node1.column + ' Linha: ' + node1.line + ' Peca: ' + node1.piece);
        console.log('Peca destino, Coluna: ' + node2.column + ' Linha: ' + node2.line + ' Peca: ' + node2.piece);

        if (node2.column.charCodeAt(1) < node1.column.charCodeAt(1) && node2.line < node1.line)
        {
            ctrl = 1;
            increment = (node1.line - node2.line)*-1;
            console.log(increment);
        }
        else if (node2.column.charCodeAt(1) == node1.column.charCodeAt(1) && node2.line < node1.line)
        {
            ctrl = 2;
            increment = (node1.line-node2.line)*-1;
        }
        else if (node2.column.charCodeAt(1) > node1.column.charCodeAt(1) && node2.line < node1.line)
        {
            ctrl = 3;
            increment = (node1.line-node2.line)*-1;
        }
        else if (node2.line == node1.line && node2.column.charCodeAt(1) < node1.column.charCodeAt(1))
        {
            ctrl = 4;
            increment = (node1.column.charCodeAt(1) - node2.column.charCodeAt(1))*-1;
        }
        else if (node2.line == node1.line && node2.column.charCodeAt(1) > node1.column.charCodeAt(1))
        {
            ctrl = 5;
            increment = node2.column.charCodeAt(1) - node1.column.charCodeAt(1);
        }
        else if (node2.line > node1.line && node2.column.charCodeAt(1) < node1.column.charCodeAt(1))
        {
            ctrl = 6;
            increment = (node1.column.charCodeAt(1) - node2.column.charCodeAt(1))*-1;
        }
        else if (node1.column.charCodeAt(1) == node2.column.charCodeAt(1) && node2.line > node1.line)
        {
            ctrl = 7;
            increment = node2.line - node1.line;
        }
        else if (node2.line > node1.line && node2.column.charCodeAt(1) > node1.column.charCodeAt(1))
        {
            ctrl = 8;
            increment = node2.line - node1.line;
        }

        var controlPoints = [];
        controlPoints.push(new Array(this.graph.nodes[node1.nodeID].animationMatrix[12], this.graph.nodes[node1.nodeID].animationMatrix[13], this.graph.nodes[node1.nodeID].animationMatrix[14]));

        switch (ctrl)
        {
            case 1:
            controlPoints.push(new Array(8.4*increment, 0.0001, 8.4*increment));
            break;

            case 2:
            controlPoints.push(new Array(0.0001, 0.0001, 8.4*increment));
            break;

            case 3:
            controlPoints.push(new Array(-8.4*increment, 0.0001, 8.4*increment));
            break;

            case 4:
            controlPoints.push(new Array(8.4*increment, 0.0001, 0.0001));
            break;

            case 5:
            controlPoints.push(new Array(8.4*increment, 0.0001, 0.0001));
            break;

            case 6:
            controlPoints.push(new Array(8.4*increment, 0.0001, -8.4*increment));
            break;

            case 7:
            controlPoints.push(new Array(0.0001, 0.0001, 8.4*increment));
            break;

            case 8:
            controlPoints.push(new Array(8.4*increment, 0.0001, 8.4*increment));
            break;

            default:
            break;
        }

        var animation1 = new MyLinearAnimation(this, animationName, "linear", 8, controlPoints);
        this.graph.animations[animationName] = animation1;
        this.graph.nodes[node1.nodeID].animationsID.push(animationName);
        this.graph.nodes[node1.nodeID].animationElapsedTime = 0;

        this.graph.nodes[node1.nodeID].updateLineColumn(node2.column,node2.line);
        console.log('Depois de mover: ');
        console.log('Peca origem, Coluna: ' + this.graph.nodes[node1.nodeID].column + ' Linha: ' + this.graph.nodes[node1.nodeID].line + 
        ' Peca: ' + this.graph.nodes[node1.nodeID].piece);
    }

    //--------------------------------------------

    var controlPoints2 = [];
    controlPoints2.push(new Array(this.graph.nodes[node22.nodeID].transformMatrix[12], 
        this.graph.nodes[node22.nodeID].transformMatrix[13], this.graph.nodes[node22.nodeID].transformMatrix[14]));
    controlPoints2.push(new Array(this.graph.nodes[node22.nodeID].transformMatrix[12], 20, 
        this.graph.nodes[node22.nodeID].transformMatrix[14]));
    controlPoints2.push(new Array(100, 20, 0));
    controlPoints2.push(new Array(100, this.graph.nodes[node22.nodeID].transformMatrix[13], 0));

    var animation2 = new MyBezierAnimation(this, "secondMove", "bezier", 100, controlPoints2);
    this.graph.animations["secondMove"] = animation2;
    this.graph.nodes[node2.nodeID].animationsID.push("secondMove");
    this.graph.nodes[node2.nodeID].animationElapsedTime = 0;
}

XMLscene.prototype.randomName = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}


XMLscene.prototype.logPicking = function()
{   
    if (!this.gameStarted || this.pauseGame)
        return;

    if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{

                    if (this.pickResults[0][0].dead)
                        return;

                    if (this.firstPickedNode != null && obj.nodeID == this.firstPickedNode.nodeID) {
                        this.firstPickedNode = null;
                        this.secondPickedNode = null;
                        this.selectableNodes = "None";
                        this.clearPickRegistration();
                        this.pickMode = true;
                        return; 
                    }
                        
                    if (this.game.currentPlayer == 1) {
                        if (this.firstPickedNode == null && this.pickResults[0][0].team == "white")
                            return;
                        if (this.firstPickedNode != null && this.pickResults[0][0].team == "black")
                            return;
                    }
                    else {
                        if (this.firstPickedNode == null && this.pickResults[0][0].team == "black")
                            return;
                        if (this.firstPickedNode != null && this.pickResults[0][0].team == "white")
                            return;
                    }



                    if(this.secondPickedNode == null && this.firstPickedNode != null)
                    {
                        this.secondPickedNode = this.pickResults[0][0];
                        
                        this.game.givePickedNodes(this.firstPickedNode, this.secondPickedNode);
                       
                        this.game.cycle();

                        //this.animatePieces(this.firstPickedNode, this.secondPickedNode,this.randomName());

                        this.firstPickedNode = null;
                        this.secondPickedNode = null;
                        this.selectableNodes = "None";
                        this.clearPickRegistration();
                        this.pickMode = true;
                        return;
                    }
                    this.selectableNodes =  this.pickResults[0][0].nodeID;
                    var customId = this.pickResults[i][1];
                    this.firstPickedNode = this.pickResults[0][0];
                    console.log("Picked object with id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

/**
 * Updates the scale factors of shaders
 */
XMLscene.prototype.updateScaleFactor = function(date)
{
    this.shader.setUniformsValues({time: date});
};

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
    
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];
            
            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
            
            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
    
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
}

XMLscene.prototype.registerForPicking = function(id,object)
{
    this.registerForPick(id, object);
};

/**
 * Updates every node to their current animated matrix.
 */
XMLscene.prototype.update = function(currTime) {
	var deltaTime = (currTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currTime;
    
	for(var node in this.graph.nodes){
        this.graph.nodes[node].applyAnimation(deltaTime);
        this.graph.nodes[node].updatePositions();
    }
}

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() 
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);

    //Add selectable nodes check boxes
    //this.interface.addSelectableNodes(this.graph.selectableNodes);

    this.interface.addOptions();
}

/**
 * Handles the starting of the game
 */
XMLscene.prototype.startGame = function ()
{
    if (this.gameStarted) {
        return;
    }
    else {
        this.gameStarted = true;
        this.gameStatus = this.gameStatusOptions[this.startingPlayer];
        this.game.gameMode = this.Type;
        this.game.botDifficulty = this.Difficulty;
        console.log("Type:" +  this.game.gameMode);
        console.log("Difficulty: " + this.game.botDifficulty);
    }
}

XMLscene.prototype.pauseGame = function ()
{

}

XMLscene.prototype.startCams = function()
{
    this.cameras[0] = new CGFcamera(0.4,0.1,500,vec3.fromValues(0.186868, 7.508605, 6.870955),vec3.fromValues(0.210242, 0.971526, -0.737233));
    this.cameras[1] = new CGFcamera(0.4,0.1,500,vec3.fromValues(0.186868, -7.508605, -6.870955),vec3.fromValues(0.210242, 0.971526, -0.737233));
    this.cameras[2] = new CGFcamera(0.4,0.1,500,vec3.fromValues(6.284444, 8.675453, -0.100106),vec3.fromValues(-0.495502, 1.905979, -0.097830));
    this.cameras[3] = new CGFcamera(0.4,0.1,500,vec3.fromValues(-7.650352, 8.345042, -0.149275),vec3.fromValues(0.025431, 2.612263, -0.053628));
    this.cameras[4] = new CGFcamera(0.4,0.1,500,vec3.fromValues(0.094776, 11.472537, 0.392229),vec3.fromValues(-0.016847, 1.898517, -0.046128));
    //this.camera = this.cameras[4];
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup
    
    if (this.gameStarted || !this.pauseGame){
        this.logPicking();
        this.clearPickRegistration();
        //this.updateCamera();
    }

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();
    
    if (this.graph.loadedOk) 
    {        
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

		// Draw axis
		//this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        var newDate = new Date();
        currTime = newDate.getTime();
        if(this.SceneinitTime == null) {
            this.SceneinitTime = currTime;
        }

        if (this.pauseGame && this.oldTimeElapsed == null) {
            this.oldTimeElapsed = this.timeElapsed;
        }
        else if (!this.pauseGame && this.oldTimeElapsed != null) {
            this.ElapsedTime = this.oldTimeElapsed;
        }
        /*
        if (this.gameStarted && !this.pauseGame) 
        {
            var newDateElapsedTime = new Date();
            currTimeElapsed = newDateElapsedTime.getTime();
            if(this.SceneinitTimeElapsed == null) 
            {
                this.SceneinitTimeElapsed = currTimeElapsed;
            }
            time = (currTimeElapsed - this.SceneinitTimeElapsed)/1000;
            this.TimeElapsed = Math.floor(time);
        }*/

        dT = (currTime - this.sceneInitTime)/1000;

        this.updateScaleFactor(dT);

        // Displays the scene.
        this.graph.displayScene();
    }
	else
	{
		// Draw axis
		this.axis.display();
	}
    

    this.popMatrix();
    
    // ---- END Background, camera and axis setup
    
}
