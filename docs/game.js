import Player from './jugador/player.js'
import Canon from './jugador/canon.js'
import Tank from './jugador/tank.js'
import PoolBalas from './balas/balasPool.js'
import ExplosionAnim from './balas/explosion.js'
import * as _c from './constantes.js'

export default class Game extends Phaser.Scene { //es una escena
  constructor() {
    super({ key: 'main' });
  }

  //es llamado cuando esta escne se carga
  init(data) {
    this.playerData = data; //la informacion de las armas seleccionadas
    this.iconoArmaPrincipal = this.add.image(32, 608, data.principal).setScale(0.7).setDepth(10);;
    this.iconoArmaSecundaria = this.add.image(85, 618, data.secundaria).setScale(0.45).setDepth(10);;
  }

  preload() {
    this.load.image('tank', 'assets/redTank.png');
    this.load.image('redBarrel1', 'assets/redBarrel.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/jsonMapDef1.json');
    this.load.image('patronesTilemap', 'assets/tilesDibujitosV2.png');
    this.load.image('bala1', 'assets/bala1.png');
    this.load.image('balaMortero', 'assets/balaMortero.png')
    this.load.spritesheet('animacion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('barraVida', 'assets/BarraVida.png');
    this.load.image('containerVida', 'assets/ContainerVida.png');
  } //cargar los recursos

  create() {
    this.input.setDefaultCursor('url(assets/icon.cur), pointer'); //cambio del cursor

    this.player = new Player(this, _c.settPlayer.posicionInicial.x, _c.settPlayer.posicionInicial.y); //crea un container Player
    let tank = new Tank(this, 'tank', this.player).setOrigin(0.5, 0.5); //se crea el tanque en si
    this.barrel = new Canon(this, 'redBarrel1', this.player).setOrigin(0.5, 0); //se crea el cañon

    this.player.add(tank);
    this.player.add(this.barrel); //se les añade al container player

    this.lifeContainer = this.add.image(_c.settBarraVida.posicionContainer.x, _c.settBarraVida.posicionContainer.y, 'containerVida').setOrigin(0, 0).setDepth(10);
    this.lifeContainer.displayWidth = _c.settBarraVida.widthContainer;
    this.lifeBar = this.add.image(_c.settBarraVida.posicionBarra.x, _c.settBarraVida.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9);
    this.lifeBar.displayWidth = _c.settBarraVida.widthContainer;

    this.shootContainer = this.add.image(_c.settBarraRech.posicionContainer.x, _c.settBarraRech.posicionContainer.y, 'containerVida').setOrigin(0, 0);
    this.shootContainer.setDepth(10).setAngle(90).setTint(_c.settBarraRech.colorContainer);
    this.shootContainer.displayWidth = _c.settBarraRech.widthContainer;
    this.shootBar = this.add.image(_c.settBarraRech.posicionBarra.x, _c.settBarraRech.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9).setAngle(90).setTint(0x26ff00);
    this.shootBar.displayWidth = _c.settBarraRech.widthContainer - _c.settBarraRech.margenWidth;
    this.speedRecharge = 0;

    this.isShootable = false;
    this.recharging = true; //empiezan del reves por q si no cuendo cambias de escene dispara ya de una

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
    this.poolBalasSimples = new PoolBalas(this, paredes, this.player, 'bala1', _c.settBSimples.cantidadPool, 'disparosimple', _c.settBSimples.velocidad, _c.settBSimples.aceleracion, _c.settBSimples.rebotes, _c.settBSimples.cadencia, _c.settBSimples.daño); //crea la pool de todos las balas simples
    this.poolBalasRafagas = new PoolBalas(this, paredes, this.player, 'bala1', _c.settBRaf.cantidadPool, 'rafagas', _c.settBRaf.velocidad, _c.settBRaf.aceleracion, _c.settBRaf.rebotes, _c.settBRaf.cadencia, _c.settBRaf.daño);
    this.poolBalasMortero = new PoolBalas(this, null, this.player, 'balaMortero', _c.settBMortero.cantidadPool, 'mortero', _c.settBMortero.velocidad, _c.settBMortero.aceleracion, _c.settBMortero.rebotes, _c.settBMortero.cadencia, _c.settBMortero.daño, _c.settBMortero.rango);
    this.poolBalasRebotador = new PoolBalas(this, paredes, this.player, 'bala1', _c.settBRebot.cantidadPool, 'rebotador', _c.settBRebot.velocidad, _c.settBRebot.aceleracion, _c.settBRebot.rebotes, _c.settBRebot.cadencia, _c.settBRebot.daño);
  }//inicializa todo                     //scena,paredes,     player ,  sprite,unidades,disparo, velocidad,aceleracion,rebotes,cadencia,daño, rango

  update() {
    if (this.shootContainer.displayWidth > this.shootBar.displayWidth + _c.settBarraRech.margenWidth) {
      this.shootBar.displayWidth += this.speedRecharge;
    }
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
    let pos = {x: this.player.x, y :this.player.y};
    return pos;
  }

  explosion(x, y) {
    new ExplosionAnim(this, x, y, 'animacion'); //crea la animacion de la explosion en el lugar dado
  }

  cambiarIconosArmas() {
    let textureP = this.iconoArmaPrincipal.texture; //guarda la texturas para luego invertirlas
    this.iconoArmaPrincipal.setTexture(this.iconoArmaSecundaria.texture.key);
    this.iconoArmaSecundaria.setTexture(textureP.key);
  }


  //se llama al disparar y resetea la barra de recarga
  triggerRechargeUI = function (time) {
    console.log(time);
    this.shootBar.displayWidth = 0;
    this.speedRecharge = _c.settBarraRech.velocidadUIRecarga / time;
    this.shootBar.setTint(_c.settBarraRech.colorBarraCharged);
  }


  toggleShoot = function () {
    this.isShootable = true;
    this.recharging = false;
    this.shootBar.setTint(_c.settBarraRech.colorBarraNormal);
  }
}