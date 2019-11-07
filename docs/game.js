import Player from './player.js'
import Canon from './canon.js'
import Tank from './tank.js'

export default class Game extends Phaser.Scene { //es una escena
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('tank', 'assets/redTank.png');
    this.load.image('redBarrel1', 'assets/redBarrel.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/map.json');
    this.load.image('patronesTilemap', 'assets/cosararaTiles.png');
  } //cargar los recursos


  create() {

    this.input.setDefaultCursor('url(assets/icon.cur), pointer'); //cambio del cursor

    this.player = new Player(this, 100, 100); //crea un container Player
    let tank = new Tank(this, 'tank', this.player).setOrigin(0.5,0.5); //se crea el tanque en si
    let barrel = new Canon(this, 'redBarrel1', this.player).setOrigin(0.5, 0); //se crea el cañon
    this.player.add(tank);
    this.player.add(barrel); //se les añade al container player
    
    let map = this.make.tilemap({ key: 'tilemap' }); //se crea el tilemap
    let tileset = map.addTilesetImage('tiles', 'patronesTilemap'); //se crea el tileset desde el tilesheet
    map.createStaticLayer("Fondo", tileset, 0, 0).setDepth(-1); //se crea el fondo desde el tileset
  }//inicializa todo

  update() {
  }
}