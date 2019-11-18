import Game from './game.js'

export default class Player extends Phaser.GameObjects.Container { //es un container
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene.add.existing(this); //le dice a la scene Game que existe
    this.scene.physics.add.existing(this); //le otorga presencia fisica
    this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida
    this.body.setCircle(15, -15, -15);
    this._maxSpeed = 100;
    this.speed = this._maxSpeed;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.sceneMain = scene;
    this._maxLife = 100;
    this.life = this._maxLife;

    this.u = scene.input.keyboard.addKey('U');
    this.j = scene.input.keyboard.addKey('J');
    this.k = scene.input.keyboard.addKey('K');

    this.dealDmg = function (damage) {
      this.life -= damage;

      if (this.life >= 0) {
        console.log('Vida: ' + this.life);
      } else {
        this.life = 0;
        console.log('Murio wey');
      }
    }

    this.revive = function () {
      this.life = this._maxLife;
      console.log('1up');
    }
  }

  preUpdate() {

    if (this.u.isDown) {
      this.dealDmg(-10);
    }
    if (this.j.isDown) {
      this.dealDmg(10);
    }

    if (this.k.isDown) { this.revive(); }

    if ((this.cursors.up.isDown || this.cursors.down.isDown) && (this.cursors.left.isDown || this.cursors.right.isDown)) this.speed = this._maxSpeed * 71 / 100;
    else this.speed = this._maxSpeed;
    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
    } else this.body.setVelocityY(0);

    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
    } else this.body.setVelocityX(0);

    this.sceneMain.lifeUI.setText('Life: '+this.life);

  }
}

