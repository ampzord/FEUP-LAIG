/**
 * MyCylinderWithTops
 * @constructor
 */
function MyCylinderWithTops(scene, args) {
    CGFobject.call(this, scene);

    this.argsRaw = args;

    args = args.split(" ");
    this.height = parseFloat(args[0]);
    this.botRad = parseFloat(args[1]);
    this.topRad = parseFloat(args[2]);
    this.stacks = parseFloat(args[3]);
    this.slices = parseFloat(args[4]);
    this.topTrue = parseFloat(args[5]);
    this.botTrue = parseFloat(args[6]);

    this.cylinder = new MyCylinder(scene, this.argsRaw);
    this.baseCyl = new MyCylinderTops(scene, this.botRad, this.slices);
    this.topCyl = new MyCylinderTops(scene, this.topRad, this.slices);
};

MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
MyCylinderWithTops.prototype.constructor = MyCylinderWithTops;

MyCylinderWithTops.prototype.display = function() 
{
    this.cylinder.display();

    //Bottom Cylinder
    if (this.botTrue == 1) 
    {
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.scale(this.botRad, this.botRad, 1);
            this.baseCyl.display();
        this.scene.popMatrix();
    }

    //Top Cylinder
    if (this.topTrue == 1) 
    {
        this.scene.pushMatrix();
            this.scene.translate(0, 0, this.height);
            this.scene.scale(this.topRad, this.topRad, 1);
            this.topCyl.display();
        this.scene.popMatrix();
    }
}

MyCylinderWithTops.prototype.applyAf = function (afS,afT){};