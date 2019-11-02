export default class Player extends Phaser.GameObjects.Container { //es un gameobject
  constructor(scene, imag) {
    let aspecto = scene.add.sprite(0,0,imag).setOrigin(0,0); //creas el sprite
    super(scene, 100, 100, aspecto);
    this.scene.add.existing(this); //le dice a la scene Game que existe
    this.scene.physics.add.existing(this); //¿le da físicas?
    this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida

    this.speed = 100;

    this.cursors = this.scene.input.keyboard.createCursorKeys(); //el cursor de los huevos
  }


  preUpdate() {
    this.body.setVelocityY(0);
    this.body.setVelocityX(0);
    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
    }
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
    }
    if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
    }
    if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
    }
  }
}