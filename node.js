
//CONSTRUCTOR
function Node()
{
	this.ID = null;
	this.descendants = [];
	this.mat = null;
	this.texture = null;
	//...
};

//FUNCTIONS
Node.prototype.push = function(nodeName)
{
	this.descendants.push(nodeName);
};

Node.prototype.getSize = function() 
{
	return this.descendants.length;
};

Node.prototype.setMatrix = function(m) 
{
	this.mat = mat4.clone(m)
};