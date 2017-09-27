/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

//Como verificar o nome do atributo e mais informacoes sobre os args
//rectangle tem 2 atributos e cylinder tem 3

function MyGraphLeaf(graph, leafData)
{
	//type and args
	if (leafData.attributes.length == 2) {
		this.type = leafData.attributes[0];
		this.args = leafData.attributes[1];
	}
	//id, type and args
	else {
		this.id = leafData.attributes[0];
		this.type = leafData.attributes[1];
		this.args = leafData.attributes[2];
	}
	
}

