export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('ey', 'favicon.png');
    this.load.image('fondo', 'fondo.png');
    this.load.image('ground', 'platform.png');
  } //cargar los recursos

  create() {
    this.add.image(0, 0, 'fondo').setOrigin(0, 0).setScale(1.4);

    let platforms;

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    let player = this.physics.add.sprite(100, 450, 'ey');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.body.setGravityY(300);

    this.physics.add.collider(player, platforms);

  }//inicializa todo

  update(time, delta) {

  }
}