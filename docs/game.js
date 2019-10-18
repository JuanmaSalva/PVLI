import Player from './player.js'

export default class Game extends Phaser.Scene { //es una escena
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

    platforms = this.physics.add.staticGroup(); //crea un "objeto vacio" statico

    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //crea la base y el refrech sirve para actualizar su collider

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground'); //crea las plataformas hijas del grupo

    this.player = new Player(this); //crea un player

    this.physics.add.collider(platforms, this.player);

  }//inicializa tod0
}