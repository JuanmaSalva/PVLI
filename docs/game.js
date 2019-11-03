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

    //this.load.tilemapTiledJSON('tilemap','mapa1.json');
    //this.load.image('patronesTilemap' , 'terrainTiles_retina.png')
  } //cargar los recursos


  create() {

    this.add.image(0, 0, 'fondo').setOrigin(0, 0);
    this.player = new Player(this, 'tank',100,100); //crea un container Player
    //this.p = new Player(this,'redBarrel1',500,500); //PROVISIONAL
    
    
    let barrel = new Canon(this,'redBarrel1',this.player).setOrigin(0.5,0);
    this.player.add(barrel);  

    //let mappy = this.add.tilemap('tilemap');
    //let terrain = mappy.addTilesetImage('patrones', 'patronesTilemap');
    //let botLayer = mappy.createStaticLayer("bot", [terrain]. 0 ,0);
    }//inicializa todo

  update(){
  }
}