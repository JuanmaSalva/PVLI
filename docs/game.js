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
    //this.load.tilemapTiledJSON('tilemap','mapa1.json');
    //this.load.image('patrinesTilemap' , 'terrainTiles_retina.png')
  } //cargar los recursos


  create() {
    /*this.map = this.make.tilemap({
      key: 'tilemap',
      tileWidth: 128,
      tileHeight: 128
    })

    this.map.addTilesetImage('patrones', 'patronesTilemap')*/

    this.add.image(0, 0, 'fondo').setOrigin(0, 0);
    this.player = new Player(this, 'tank'); //crea un container Player
    let barrel = new Canon(this,'redBarrel1',this.player);
    this.player.add(barrel);
    }//inicializa todo

  update(){
  }
}