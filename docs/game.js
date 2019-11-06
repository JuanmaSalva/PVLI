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

    this.input.setDefaultCursor('url(assets/icon.cur), pointer');

    this.player = new Player(this, 100, 100); //crea un container Player
    let barrel = new Canon(this, 'redBarrel1', this.player).setOrigin(0.5, 0);
    let tank = new Tank(this, 'tank', this.player).setOrigin(0.5,0.5);
    this.player.add(tank);
    this.player.add(barrel);
    
    let map = this.make.tilemap({ key: 'tilemap' });
    let tileset = map.addTilesetImage('tiles', 'patronesTilemap');
    map.createStaticLayer("Fondo", tileset, 0, 0).setDepth(-1);
  }//inicializa todo

  update() {
  }
}