/**
 * MyCylinderWithTops
 * @constructor
 */
function MyCylinderWithTops(scene, args) {
    CGFobject.call(this, scene);

    args = args.split(" ");
    this.botRad = parseFloat(args[1]);
    this.topRad = parseFloat(args[2]);
    this.slices = parseFloat(args[4]);
    


    this.cylinder = new MyCylinder(scene, args);
    this.baseCyl = new MyCylinderTops(scene, this.botRad, this.slices);
    this.topCyl = new MyCylinderTops(scene, this.topRad, this.slices);
};

MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
MyCylinderWithTops.prototype.constructor = MyCylinderWithTops;

MyCylinderWithTops.prototype.display = function() 
{
    this.cylinder.display();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.baseCyl.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.topCyl.display();
    this.scene.popMatrix();
}