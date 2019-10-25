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
    this.player = new Player(this); //crea un player
    }//inicializa tod0

  update(){
  }
}