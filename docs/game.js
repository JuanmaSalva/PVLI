import Player from './jugador/player.js'
import Canon from './jugador/canon.js'
import Tank from './jugador/tank.js'
import PoolBalas from './balas/balasPool.js'
import ExplosionAnim from './balas/explosion.js'

export default class Game extends Phaser.Scene { //es una escena
  constructor() {
    super({ key: 'main' });
  }

  //es llamado cuando esta escne se carga
  init(data){
    this.playerData = data; //la informacion de las armas seleccionadas
    this.iconoArmaPrincipal = this.add.image(32,608,data.principal).setScale(0.7).setDepth(10);;
    this.iconoArmaSecundaria = this.add.image(85,618,data.secundaria).setScale(0.45).setDepth(10);;
  }

  preload() {
    this.load.image('tank', 'assets/redTank.png');
    this.load.image('redBarrel1', 'assets/redBarrel.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/jsonMapDef1.json');
    this.load.image('patronesTilemap', 'assets/tilesDibujitosV2.png');
    this.load.image('bala1', 'assets/bala1.png');
    this.load.image('balaMortero' ,'assets/balaMortero.png')
    this.load.spritesheet('animacion', 'assets/explosion.png',{frameWidth:64,frameHeight:64});
  } //cargar los recursos

  create() {
    this.input.setDefaultCursor('url(assets/icon.cur), pointer'); //cambio del cursor

    this.player = new Player(this, 100, 100); //crea un container Player
    let tank = new Tank(this, 'tank', this.player).setOrigin(0.5, 0.5); //se crea el tanque en si
    this.barrel = new Canon(this, 'redBarrel1', this.player).setOrigin(0.5, 0); //se crea el cañon
    
    this.player.add(tank);
    this.player.add(this.barrel); //se les añade al container player
    this.lifeUI = this.add.text(10, 4, 'Life: 100', { font: '24px Arial', fill: '#ffffff' });
    this.lifeUI.setDepth(10);
    
    this.player.setArmas(this.playerData.principal, this.playerData.secundaria);
    this.player.canon = this.barrel;

    let map = this.make.tilemap({
      key: 'tilemap',
      tileWidth: 64,
      tileHeight: 64
    }); //se crea el tilemap

    let tileset = map.addTilesetImage('tilesDibujitosV2', 'patronesTilemap'); //se crea el tileset desde el tilesheet
    map.createStaticLayer("Background", tileset, 0, 0).setDepth(-2).setScale(0.5); //se crea el fondo desde el tileset
    let paredes = map.createStaticLayer("Walls", tileset, 0, 0).setDepth(-1).setScale(0.5);  //Capa de las paredes
    map.createStaticLayer("Deco", tileset, 0, 0).setDepth(0).setScale(0.5);
    paredes.setCollisionBetween(0, 999); //Hacemos que todos los tiles de esta capa collisionen
    this.physics.add.collider(this.player, paredes);  // avisamos a phaser que player colisona con paredes

    //CREACION DE LAS POOLS DE BALAS           //esta el player para las colisiones                                     
    this.poolBalasSimples = new PoolBalas(this, paredes,this.player, 'bala1', 10, 'disparosimple', 500, 0, 1, 700, 20); //crea la pool de todos las balas simples
    this.poolBalasRafagas = new PoolBalas(this, paredes,this.player, 'bala1', 15, 'rafagas', 500, 0, 0, 1000, 13);
    this.poolBalasMortero = new PoolBalas(this, null,this.player, 'balaMortero', 7, 'mortero', 1000, 0, 0, 1000, 13, 250);    
    this.poolBalasRebotador = new PoolBalas(this, paredes,this.player, 'bala1', 10, 'rebotador', 500, 100, 5, 1000, 17);
  }//inicializa todo                     //scena,paredes,     player ,  sprite,unidades,disparo, velocidad,aceleracion,rebotes,cadencia,daño, rango

  update() {
  }
  

  setRangeMortero = function (rango) {
    this.barrel.setRange(rango);
  }

  //se ha disparado y segun el arma se llama a la pool adecuada
  spawnBala = function (x, y, arma) {
    if (arma == 'disparoSimple') this.poolBalasSimples.shoot(x, y);
    else if (arma == 'rafagas') this.poolBalasRafagas.shoot(x, y);
    else if (arma == 'rebotador') this.poolBalasRebotador.shoot(x, y);
    else if (arma == 'mortero') this.poolBalasMortero.shoot(x, y);
  }

  //devuelve la posicion del jugador
  canonPosition = function () {
    let pos = [this.player.x, this.player.y]
    return pos;
  }

  explosion(x,y){
    new ExplosionAnim(this,x,y,'animacion'); //crea la animacion de la explosion en el lugar dado
  }

  cambiarIconosArmas(){   
    let textureP = this.iconoArmaPrincipal.texture; //guarda la texturas para luego invertirlas
    this.iconoArmaPrincipal.setTexture(this.iconoArmaSecundaria.texture.key);
    this.iconoArmaSecundaria.setTexture(textureP.key);
  }
}