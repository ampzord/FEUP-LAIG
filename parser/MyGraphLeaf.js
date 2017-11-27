/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/
function MyGraphLeaf(graph, type, args)
{
	this.primitive = null;
	this.type = type;
	this.args = args;

	switch(this.type) 
	{
		case 'rectangle':
		this.primitive =  new MyRectangle(graph.scene, this.args);
		break;

		case 'sphere':
		this.primitive = new MySphere(graph.scene, this.args);
		break;

		case 'cylinder':
		if (this.args[5] == 0 && this.args[6] == 0) {
			this.primitive = new MyCylinder(graph.scene, this.args);
		}
		else {
			this.primitive = new MyCylinderWithTops(graph.scene, this.args);
		}
		break;

		case 'triangle':
		this.primitive = new MyTriangle(graph.scene, this.args);
		break;

		case 'patch':
		this.primitive = new MyPatch(graph.scene, this.args);
		break;
	}
}

/*
* Applies amplification factors from texture
*/
MyGraphLeaf.prototype.applyAf = function(afS,afT){
		this.primitive.applyAf(afS,afT);
};

/*
* Displays the primitive
*/

MyGraphLeaf.prototype.display = function(){
		this.primitive.display();
};

