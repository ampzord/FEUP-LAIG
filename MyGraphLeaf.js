/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/
function MyGraphLeaf(graph, leafData)
{
	this.primitive = null;
	//type and args
	if (leafData.attributes.length == 2) {
		this.type = leafData.attributes[0].value
		this.args = leafData.attributes[1].value;
		this.patchInfo = leafData;
	}
	//id, type and args
	else {
		this.id = leafData.attributes[0].value;
		this.type = leafData.attributes[1].value;
		this.args = leafData.attributes[2].value;
	}

	switch(this.type) 
	{
		case 'rectangle':
		this.primitive =  new MyRectangle(graph.scene, this.args);
		break;

		case 'sphere':
		this.primitive = new MySphere(graph.scene, this.args);
		break;

		case 'cylinder':
		this.argsSplit = this.args.split(" ");
		if (this.argsSplit[5] == 0 && this.argsSplit[6] == 0) {
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
		this.primitive = new MyPatch(graph.scene, this.patchInfo, this.args);
		break;
	}
}

MyGraphLeaf.prototype.applyAf = function(afS,afT){
		this.primitive.applyAf(afS,afT);
};

MyGraphLeaf.prototype.display = function(){
		this.primitive.display();
};

