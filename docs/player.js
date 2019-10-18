export default class Player extends Phaser.GameObjects.Sprite{ //es un gameobject
constructor(scene){
    super(scene, 100,100, 'ey');
    this.scene.add.existing(this); 
    this.scene.physics.add.existing(this); 
    this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida

    
    this.speed = 300;
    this.jumpSpeed = -400;
    
    this.cursors = this.scene.input.keyboard.createCursorKeys(); //el cursor de los huevos

    }


preUpdate(){
  if (this.cursors.up.isDown && this.body.onFloor()) {
      this.body.setVelocityY(this.jumpSpeed);
    }
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
    }
    else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);

    }
    else {
      this.body.setVelocityX(0);  
    }
}
}