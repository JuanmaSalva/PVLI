export default class Tank extends Phaser.GameObjects.Sprite {
  constructor(scene, imag, parent) { //imag es el sprite que se va a cargar
    super(scene, 0, -1, imag);
    this.scene.add.existing(this); //le dice a la scene Game que existe        
    this.parent = parent;
  }

  preUpdate() {
    if (this.parent.cursors.up.isDown || this.parent.w.isDown) {
      this.angle = (0 + this.angle) / 2;
    } else if (this.parent.cursors.down.isDown || this.parent.s.isDown) {
      this.angle = (180 + this.angle) / 2;
    }
    if (this.parent.cursors.right.isDown || this.parent.d.isDown) {
      this.angle = ((90 + this.angle) / 2);
    } else if (this.parent.cursors.left.isDown || this.parent.a.isDown) {
      this.angle = -((270 + this.angle) / 2) - 90;
    }
  }
}