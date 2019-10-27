import Player from './player.js'
import Canon from './canon.js'

export default class Game extends Phaser.Scene { //es una escena
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('tank', 'redTank.png');
    this.load.image('fondo', 'fondo.png');
    this.load.image('ground', 'platform.png');
    this.load.image('redBarrel1', 'redBarrel.png');
  } //cargar los recursos


  create() {
    this.add.image(0, 0, 'fondo').setOrigin(0, 0);
    this.player = new Player(this, 'tank'); //crea un container Player
    let barrel = new Canon(this,'redBarrel1');
    this.player.add(barrel);
    }//inicializa todo

  update(){
  }
}