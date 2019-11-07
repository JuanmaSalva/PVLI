export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(scene, imag, parent) { //imag es el sprite que se va a cargar
    super(scene, 0, -1, imag);
    this.scene.add.existing(this); //le dice a la scene Game que existe        
    this.parent = parent;
    let angleObj, dir, oldAngle = 0;
  }

  preUpdate() {
    this.dir = 0;
    this.angleObj = 0;

    if (this.parent.cursors.up.isDown) {
      this.angleObj += this.oldAngle = 0;
      this.dir += 1;
    } else if (this.parent.cursors.down.isDown) {
      this.angleObj += this.oldAngle = 180;
      this.dir += 1;      
    }
    if (this.parent.cursors.right.isDown) {
      this.angleObj += this.oldAngle = 90;
      this.dir += 1;      
    } else if (this.parent.cursors.left.isDown) {
      this.angleObj += this.oldAngle = 270;
      this.dir += 1;
    }
    if(this.angle = this.angleObj/(this.dir||1)){}
    else this.angle = this.oldAngle||0;

  }
}