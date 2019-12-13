export default class Tank2 extends Phaser.GameObjects.Sprite {
    constructor(scene, imag, parent) { //imag es el sprite que se va a cargar
      super(scene, 0, -1, imag);
      this.scene.add.existing(this); //le dice a la scene Game que existe        
      this.parent = parent;
    }
}
