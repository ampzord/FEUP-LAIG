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

    var date = new Date();
    this.sceneInitTime = date.getTime();
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

    this.setPickEnabled(true);
}

XMLscene.prototype.updateCamera = function ()
{
    this.camera = this.cameras[this.CameraChosen];
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
                    this.selectableNodes =  this.pickResults[0][0].nodeID;
                    var customId = this.pickResults[i][1];
                    /*console.log('Column: ' + this.pickResults[0][0].column);
                    console.log('Line: ' + this.pickResults[0][0].line);
                    console.log('X: ' + this.pickResults[0][0].positionX);
                    console.log('Y: ' + this.pickResults[0][0].positionY);
                    console.log('Z: ' + this.pickResults[0][0].positionZ);*/
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
    this.interface.addSelectableNodes(this.graph.selectableNodes);

    this.interface.addOptions();
   
}

XMLscene.prototype.startGame = function ()
{
    this.gameStarted = true;

    // TODO

}

XMLscene.prototype.startCams = function()
{
    this.cameras[0] = new CGFcamera(0.4,0.1,500,vec3.fromValues(0.186868, 7.508605, 6.870955),vec3.fromValues(0.210242, 0.971526, -0.737233));
    this.cameras[1] = new CGFcamera(0.4,0.1,500,vec3.fromValues(0.628311038017273, -15.167302131652832, 8.596643447875977),vec3.fromValues(0.5653669834136963, 0.049721427261829376, -0.08002768456935883));
    this.cameras[2] = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 0),vec3.fromValues(0, 0, 0));
    this.cameras[3] = new CGFcamera(0.4,0.1,500,vec3.fromValues(-15, 15, 0),vec3.fromValues(0, 0, 0));
    this.cameras[4] = new CGFcamera(0.4,0.1,500,vec3.fromValues(-15, 15, 0),vec3.fromValues(0, 0, 0));
    this.camera = this.cameras[0];
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

    console.log(this.camera);

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

        if (this.gameStarted) //&& !this.pauseGame) 
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
