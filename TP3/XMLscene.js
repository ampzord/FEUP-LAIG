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
    this.apagar = null;


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

XMLscene.prototype.animatePieces = async function(node11, node22)
{
    var animationName = this.randomName();

    var node1 = this.graph.nodes[node11.nodeID];
    var node2 = this.graph.nodes[node22.nodeID];

    console.log(node1);
    console.log(node2);
    /*if (node1.piece == "'h'" || node1.piece == "'H'")
    {
        var horse = true;

        var controlPoints = [];
        controlPoints.push(new Array(this.graph.nodes[node1.nodeID].animationMatrix[12], 
            this.graph.nodes[node1.nodeID].animationMatrix[13], this.graph.nodes[node1.nodeID].animationMatrix[14]));

        console.log('x : ' + this.graph.nodes[node1.nodeID].animationMatrix[12]);
        console.log('y : ' + this.graph.nodes[node1.nodeID].animationMatrix[13]);
        console.log('z : ' + this.graph.nodes[node1.nodeID].animationMatrix[14]);

            

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
        //controlPoints.push(new Array(0, 0, 8.4));

        console.log('x : ' + this.graph.nodes[node1.nodeID].animationMatrix[12]);
        console.log('y : ' + this.graph.nodes[node1.nodeID].animationMatrix[13]);
        console.log('z : ' + this.graph.nodes[node1.nodeID].animationMatrix[14]);

        switch (ctrl)
        {
            case 1:
            console.log(ctrl);
            console.log('x : ' + this.graph.nodes[node1.nodeID].transformMatrix[12]);
            console.log('y : ' + this.graph.nodes[node1.nodeID].transformMatrix[13]);
            console.log('z : ' + this.graph.nodes[node1.nodeID].transformMatrix[14]);
            this.graph.nodes[node1.nodeID].updatePosition(node2.positionX,node2.positionY,node2.positionZ);
            console.log('x : ' + this.graph.nodes[node1.nodeID].transformMatrix[12]);
            console.log('y : ' + this.graph.nodes[node1.nodeID].transformMatrix[13]);
            console.log('z : ' + this.graph.nodes[node1.nodeID].transformMatrix[14]);
            break;

            case 2:
            controlPoints.push(new Array(0.0001, 0.0001, 8.4*increment));
            console.log(ctrl);
            break;

            case 3:
            controlPoints.push(new Array(-8.4*increment, 0.0001, 8.4*increment));
            console.log(ctrl);
            break;

            case 4:
            controlPoints.push(new Array(8.4*increment, 0.0001, 0.0001));
            console.log(ctrl);
            break;

            case 5:
            controlPoints.push(new Array(8.4*increment, 0.0001, 0.0001));
            console.log(ctrl);
            break;

            case 6:
            controlPoints.push(new Array(8.4*increment, 0.0001, -8.4*increment));
            console.log(ctrl);
            break;

            case 7:
            controlPoints.push(new Array(0.0001, 0.0001, 8.4*increment));
            console.log(ctrl);
            break;

            case 8:
            controlPoints.push(new Array(8.4*increment, 0.0001, 8.4*increment));
            console.log(ctrl);
            break;

            default:
            break;
        }

        //var animation1 = new MyLinearAnimation(this, animationName, "linear", 8, controlPoints);
        //this.graph.animations[animationName] = animation1;
        //this.graph.nodes[node1.nodeID].animationsID.push(animationName);
        //this.graph.nodes[node1.nodeID].animationElapsedTime = 0;

        
}*//*
    console.log('ANTES DE FAZER QUALQUER COISA');

    console.log('NODE1');

    console.log(node1.piece);

    console.log('initX: ' + node1.initialX);
    console.log('initY: ' + node1.initialY);
    console.log('initZ: ' + node1.initialZ);

    console.log('currentX: ' + node1.positionX);
    console.log('currentY: ' + node1.positionY);
    console.log('currentZ: ' + node1.positionZ);

    console.log('graveyardX: ' + node1.graveyardX);
    console.log('graveyardY: ' + node1.graveyardY);
    console.log('graveyardZ: ' + node1.graveyardZ);

    console.log('NODE2');

    console.log(node2.piece);

    console.log('initX: ' + node2.initialX);
    console.log('initY: ' + node2.initialY);
    console.log('initZ: ' + node2.initialZ);

    console.log('currentX: ' + node2.positionX);
    console.log('currentY: ' + node2.positionY);
    console.log('currentZ: ' + node2.positionZ);

    console.log('graveyardX: ' + node2.graveyardX);
    console.log('graveyardY: ' + node2.graveyardY);
    console.log('graveyardZ: ' + node2.graveyardZ);

    var a = node1.graveyardX;
    var b = node1.graveyardY;
    var c = node1.graveyardZ;*/


/*
    var controlPoints2 = [];
    controlPoints2.push(new Array(node2.positionX, node2.positionY, node2.positionZ));
    controlPoints2.push(new Array(node2.positionX, 20, node2.positionZ));
    
    controlPoints2.push(new Array(node2.graveyardX, 20, node2.graveyardZ));
    controlPoints2.push(new Array(node2.graveyardX, node2.graveyardY, node2.graveyardZ));


    var animationName4 = this.randomName();
    var animation2 = new MyBezierAnimation(this, animationName4, "bezier", 100, controlPoints2);
    this.graph.animations[animationName4] = animation2;
    this.graph.nodes[node2.nodeID].animationsID.push(animationName4);
    this.graph.nodes[node2.nodeID].animationElapsedTime = 0;*/
    var graveyardPosAux;
    node2.graveyardZ;
    /*
    for (let i = 0; i < 64; i++) {
        if (this.game.graveyardSpots[i].occupied == false) {
            this.game.graveyardSpots[i].occupied = true;
            graveyardPosAux = this.game.graveyardSpots[i].position;
            break;
        }
    }*/
    //console.log(graveyardPosAux[0]);
    calcDistX2 = (node2.graveyardX + Math.abs(node2.initialX-node2.positionX));
    calcDistZ2 = (node2.graveyardX + Math.abs(node2.initialX-node2.positionX));

    calcDistX = Math.abs(node2.graveyardX - node2.positionX);
    calcDistZ = Math.abs(node2.graveyardZ - node2.positionZ);
    
    var controlPoints2 = [];
    
    controlPoints2.push(new Array(0, 0, 0));
    controlPoints2.push(new Array(0, 20, 0));
    
    controlPoints2.push(new Array(calcDistX2, 20, calcDistZ2));
    controlPoints2.push(new Array(calcDistX2, 0, calcDistZ2));


    /*
    var controlPoints2 = [];
    controlPoints2.push(new Array(node2.positionX, node2.positionY, node2.positionZ));
    controlPoints2.push(new Array(node2.positionX, 20, node2.positionZ));
    
    controlPoints2.push(new Array(node2.graveyardX, 20, node2.graveyardZ));
    controlPoints2.push(new Array(node2.graveyardX, node2.graveyardY, node2.graveyardZ));*/


    var animationName4 = this.randomName();
    var animation2 = new MyBezierAnimation(this, animationName4, "bezier", 100, controlPoints2);
    this.graph.animations[animationName4] = animation2;
    this.graph.nodes[node2.nodeID].animationsID.push(animationName4);
    this.graph.nodes[node2.nodeID].animationElapsedTime = 0;





    node1.updatePosition(node2.positionX,node2.positionY,node2.positionZ);
    node1.updateLineColumn(node2.column,node2.line);


/*
    node1.updatePosition(node2.positionX,node2.positionY,node2.positionZ);
    node1.updateLineColumn(node2.column,node2.line);*/



    //this.graph.nodes[node1.nodeID].updatePosition(node2.positionX,node2.positionY,node2.positionZ);
    
    //this.graph.nodes[node1.nodeID].updateLineColumn(node2.column,node2.line);
    /*console.log('Depois de mover: ');
    console.log('Peca origem, Coluna: ' + this.graph.nodes[node1.nodeID].column + ' Linha: ' + this.graph.nodes[node1.nodeID].line + 
    ' Peca: ' + this.graph.nodes[node1.nodeID].piece);*/
    //--------------------------------------------
/*
    console.log(node1);
    console.log(node2);*/

/*
    console.log('DEPOIS DE DAR UPDATE AO NOde1');

    console.log('NODE1');

    console.log(node1.piece);

    console.log('initX: ' + this.graph.nodes[node1.nodeID].initialX);
    console.log('initY: ' + node1.initialY);
    console.log('initZ: ' + node1.initialZ);

    console.log('currentX: ' + node1.positionX);
    console.log('currentY: ' + node1.positionY);
    console.log('currentZ: ' + node1.positionZ);

    console.log('graveyardX: ' + node1.graveyardX);
    console.log('graveyardY: ' + node1.graveyardY);
    console.log('graveyardZ: ' + node1.graveyardZ);

    console.log('NODE2');

    console.log(node2.piece);

    console.log('initX: ' + node2.initialX);
    console.log('initY: ' + node2.initialY);
    console.log('initZ: ' + node2.initialZ);

    console.log('currentX: ' + node2.positionX);
    console.log('currentY: ' + node2.positionY);
    console.log('currentZ: ' + node2.positionZ);

    console.log('graveyardX: ' + node2.graveyardX);
    console.log('graveyardY: ' + node2.graveyardY);
    console.log('graveyardZ: ' + node2.graveyardZ);*/



/*
    console.log(node1);
    console.log(node2);*/

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
        this.graph.nodes[node].updatePositionValues();
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
    }
}

XMLscene.prototype.startCams = function()
{
    this.cameras[0] = new CGFcamera(0.4,0.1,500,vec3.fromValues(1.5, 10, 1),vec3.fromValues(1.5, 0, 0)); //top view
    this.cameras[1] = new CGFcamera(0.4,0.1,500,vec3.fromValues(20, 20, 1),vec3.fromValues(-2.5, 0, 0)); //angle outter view
    this.cameras[2] = new CGFcamera(0.4,0.1,500,vec3.fromValues(35, 35, 3),vec3.fromValues(0, 0, -2.5)); //outter view
    this.camera = this.cameras[2];
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup
    
    if (this.gameStarted || !this.pauseGame){
        this.logPicking();
        this.clearPickRegistration();
        this.updateCamera();
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
        }

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
