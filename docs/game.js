import Player from './player.js'
import Canon from './canon.js'

export default class Game extends Phaser.Scene { //es una escena
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('tank', 'redTank.png');
    this.load.image('fondo', 'fondo.png');
    this.load.image('redBarrel1', 'redBarrel.png');

    this.load.tilemapTiledJSON('tilemap', 'map.json');
    this.load.image('patronesTilemap' , 'cosararaTiles.png');    

  } //cargar los recursos


  create() {
    //this.add.image(0, 0, 'fondo').setOrigin(0, 0);
    this.player = new Player(this, 'tank', 100, 100); //crea un container Player    

    let barrel = new Canon(this, 'redBarrel1', this.player).setOrigin(0.5, 0);
    this.player.add(barrel);

    let map = this.make.tilemap({key: 'tilemap'});
    let tileset =map.addTilesetImage('tiles','patronesTilemap');
    let layer = map.createStaticLayer("Fondo",tileset,0,0).setDepth(-1); 
  }//inicializa todo

  update() {
  }
}