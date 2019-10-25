export default class Player extends Phaser.GameObjects.Sprite { //es un gameobject
  constructor(scene) {
    super(scene, 100, 100, 'ey');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
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