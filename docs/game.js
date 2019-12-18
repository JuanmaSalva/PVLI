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
    this.socket = data.soc;
    this.numPlayer = data.numPlayer;
    this.socket.off('disparoJ2');
  }

  preload() {
    this.load.image('tank', 'assets/redTank.png');
    this.load.image('redBarrel1', 'assets/redBarrel.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/jsonMapDef3.json');
    this.load.image('patronesTilemap', 'assets/tilesDibujitosV2.png');
    this.load.image('bala1', 'assets/bala1.png');
    this.load.image('balaMortero', 'assets/balaMortero.png')
    this.load.spritesheet('animacion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('barraVida', 'assets/BarraVida.png');
    this.load.image('containerVida', 'assets/ContainerVida.png');
    this.load.image('blueTank', 'assets/blueTank.png');
    this.load.image('blueBarrel', 'assets/blueBarrel.png');
    this.load.image('balaRebotadora', 'assets/balaRebotadora.png');

    this.load.audio('explosion', 'assets/Explosion.wav');
    this.load.audio('disparo', 'assets/Disparo.wav');
    this.load.audio('rebote', 'assets/Rebote.wav');
    this.load.audio('fondo', 'assets/fondo.wav');
    
  } //cargar los recursos

  create() {
    this.input.setDefaultCursor('url(assets/icon.cur), pointer'); //cambio del cursor
    this.pointer = this.input.activePointer; //cursor del raton


    this.player = new Player(this, _c.settPlayer.posicionInicial.x, _c.settPlayer.posicionInicial.y); //crea un container Player
    this.tank = new Tank(this, 'tank', this.player).setOrigin(0.5, 0.5); //se crea el tanque en si
    this.barrel = new Canon(this, 'redBarrel1', this.player).setOrigin(0.5, 0); //se crea el cañon

    //this.player2 = new Player2(this, _c.settPlayer2.posicionInicial.x, _c.settPlayer2.posicionInicial.y); //crea un container Player
    this.player2 = this.add.container(_c.settPlayer2.posicionInicial.x, _c.settPlayer2.posicionInicial.y);
    this.physics.add.existing(this.player2); //le otorga presencia fisica
    this.player2.body.setCollideWorldBounds().setCircle(_c.settPlayer.tamañoHitbox, -_c.settPlayer.tamañoHitbox, -_c.settPlayer.tamañoHitbox); //colisiona con los bordes de la partida
    this.player2.body.immovable = true;

    this.tank2 = this.add.sprite(0, 0, 'blueTank').setOrigin(0.5, 0.5); //se crea el tanque en si
    this.barrel2 = this.add.sprite(0, 0, 'blueBarrel').setOrigin(0.5, 0);

    this.player.add(this.tank);
    this.player.add(this.barrel); //se les añade al container player

    this.player2.add(this.tank2);
    this.player2.add(this.barrel2); //se les añade al container player

    this.lifePlayer1 = _c.settPlayer.vidaMax;
    this.lifePlayer2 = _c.settPlayer2.vidaMax;

    this.lifeContainer = this.add.image(_c.settBarraVida.posicionContainer.x, _c.settBarraVida.posicionContainer.y, 'containerVida').setOrigin(0, 0).setDepth(10);
    this.lifeContainer.displayWidth = +_c.settBarraVida.widthContainer;
    this.lifeBar = this.add.image(_c.settBarraVida.posicionBarra.x, _c.settBarraVida.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9);
    this.lifeBar.displayWidth = _c.settBarraVida.widthContainer;

    this.shootContainer = this.add.image(_c.settBarraRech.posicionContainer.x, _c.settBarraRech.posicionContainer.y, 'containerVida').setOrigin(0, 0);
    this.shootContainer.setDepth(10).setAngle(90).setTint(_c.settBarraRech.colorContainer);
    this.shootContainer.displayWidth = _c.settBarraRech.widthContainer;
    this.shootBar = this.add.image(_c.settBarraRech.posicionBarra.x, _c.settBarraRech.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9).setAngle(90).setTint(0x26ff00);
    this.shootBar.displayWidth = _c.settBarraRech.widthContainer - _c.settBarraRech.margenWidth;
    this.speedRechargeP1 = 0;

    this.isShootable = true;
    this.recharging = false; //empiezan del reves por q si no cuendo cambias de escene dispara ya de una

    this.player.setArmas(this.playerData.principal, this.playerData.secundaria);
    this.player.canon = this.barrel;

    let map = this.make.tilemap({
      key: 'tilemap',
      tileWidth: 64,
      tileHeight: 64
    }); //se crea el tilemap

    let tileset = map.addTilesetImage('tilesDibujitosV2', 'patronesTilemap'); //se crea el tileset desde el tilesheet
    map.createStaticLayer("Background", tileset, 0, 0).setDepth(-2).setScale(0.5); //se crea el fondo desde el tileset
    let paredes = map.createStaticLayer("Walls", tileset, 0, 0).setDepth(0).setScale(0.5);  //Capa de las paredes
    map.createStaticLayer("Deco", tileset, 0, 0).setDepth(1).setScale(0.5);
    map.createStaticLayer("Deco2", tileset, 0, 0).setDepth(2).setScale(0.5);
    paredes.setCollisionBetween(0, 999); //Hacemos que todos los tiles de esta capa collisionen
    this.physics.add.collider(this.player, paredes);  // avisamos a phaser que player colisona con paredes
    this.physics.add.collider(this.player2, paredes);

    //CREACION DE LAS POOLS DE BALAS           //esta el player para las colisiones                                     
    this.poolBalasSimples = new PoolBalas(this, paredes, this.player, 'bala1', _c.settBSimples.cantidadPool, 'disparosimple', _c.settBSimples.velocidad, _c.settBSimples.aceleracion, _c.settBSimples.rebotes, _c.settBSimples.cadencia, _c.settBSimples.daño, null, this.player2); //crea la pool de todos las balas simples
    this.poolBalasRafagas = new PoolBalas(this, paredes, this.player, 'bala1', _c.settBRaf.cantidadPool, 'rafagas', _c.settBRaf.velocidad, _c.settBRaf.aceleracion, _c.settBRaf.rebotes, _c.settBRaf.cadencia, _c.settBRaf.daño, null, this.player2);
    this.poolBalasMortero = new PoolBalas(this, null, this.player, 'balaMortero', _c.settBMortero.cantidadPool, 'mortero', _c.settBMortero.velocidad, _c.settBMortero.aceleracion, _c.settBMortero.rebotes, _c.settBMortero.cadencia, _c.settBMortero.daño, _c.settBMortero.rango);
    this.poolBalasRebotador = new PoolBalas(this, paredes, this.player, 'balaRebotadora', _c.settBRebot.cantidadPool, 'rebotador', _c.settBRebot.velocidad, _c.settBRebot.aceleracion, _c.settBRebot.rebotes, _c.settBRebot.cadencia, _c.settBRebot.daño, null, this.player2);
    ////////////////////////////////////////scena,paredes,     player ,  sprite,unidades,disparo, velocidad,aceleracion,rebotes,cadencia,daño, rango


    this.socket.on("updateP2", datos => {
      let angle2 = (Phaser.Math.Angle.Between(datos.cursor.x + 10, datos.cursor.y + 10, this.player2.x, this.player2.y) + Math.PI / 2);  //es 10 del tamaño del cursor
      this.barrel2.rotation = angle2;
      this.player2.body.setVelocityY(datos.velocidad.y);
      this.player2.body.setVelocityX(datos.velocidad.x);
      this.tank2.angle = datos.angulo;
    });

    this.socket.on("disparoJ2", datos => {
      this.spawnBala(datos.x, datos.y, datos.arma, true, datos.destino);
    })


    this.socket.on('finDeJuego', () => {
      this.lifePlayer2 = _c.settPlayer.vidaMax;
      this.lifePlayer1 = _c.settPlayer.vidaMax;
      this.socket.off('disparoJ2');
      this.fondoAudio.stop();
      this.scene.start('victoria',this.socket);
    })


    this.explosionAudio = this.sound.add('explosion');
    this.fondoAudio = this.sound.add('fondo')

    this.fondoAudio.play();
    this.fondoAudio.setLoop(true);
  }//inicializa todo

  update() {
    if (this.shootContainer.displayWidth > this.shootBar.displayWidth + _c.settBarraRech.margenWidth) {
      this.shootBar.displayWidth += this.speedRechargeP1;
    }

    //vida del jugador
    this.lifeBar.displayWidth = this.lifePlayer1 * _c.settBarraVida.escalaBarraA_Vida;//- _c.settBarraVida.margenWidth;

    //habria que meter hasta la linea 120 en un metodo pero ahora me voy a comer
    this.balasSimples = [];
    this.balasRafagas = [];
    this.balasRebotadoras = [];
    this.balasMortero = [];

    //guarda toda la informacion de todas las balas activas en pantalla
    for (let i = 0; i < this.poolBalasSimples.entitiesAlive.length; i++) this.balasSimples.push({ x: this.poolBalasSimples.entitiesAlive[i].x, y: this.poolBalasSimples.entitiesAlive[i].y, angle: this.poolBalasSimples.entitiesAlive[i].angle })
    for (let i = 0; i < this.poolBalasRafagas.entitiesAlive.length; i++) this.balasRafagas.push({ x: this.poolBalasRafagas.entitiesAlive[i].x, y: this.poolBalasRafagas.entitiesAlive[i].y, angle: this.poolBalasRafagas.entitiesAlive[i].angle })
    for (let i = 0; i < this.poolBalasRebotador.entitiesAlive.length; i++) this.balasRebotadoras.push({ x: this.poolBalasRebotador.entitiesAlive[i].x, y: this.poolBalasRebotador.entitiesAlive[i].y, angle: this.poolBalasRebotador.entitiesAlive[i].angle })
    for (let i = 0; i < this.poolBalasMortero.entitiesAlive.length; i++)this.balasMortero.push({ x: this.poolBalasMortero.entitiesAlive[i].x, y: this.poolBalasMortero.entitiesAlive[i].y, angle: this.poolBalasMortero.entitiesAlive[i].angle, scale: this.poolBalasMortero.entitiesAlive[i].scale })

    this.socket.emit('update', { //toda la info necesaria
      posJ1: { x: this.player.x, y: this.player.y },
      rotJ1: this.tank.angle,
      rotCanJ1: this.barrel.angle,
      posJ2: { x: this.player2.x, y: this.player2.y },
      rotJ2: this.tank2.angle,
      rotCanJ2: this.barrel2.angle,
      balasSimple: this.balasSimples,
      balasRafagas: this.balasRafagas,
      balasRebotadoras: this.balasRebotadoras,
      balasMortero: this.balasMortero,
      lifePlayer2: this.lifePlayer2,
    })
  }

  setRangeMortero = function (rango) {
    this.barrel.setRange(rango);
  }

  //se ha disparado y segun el arma se llama a la pool adecuada
  spawnBala = function (x, y, arma, J2, destino) {
    if (!J2) {
      if (arma == 'disparoSimple') this.poolBalasSimples.shoot(x, y, this.pointer.worldX, this.pointer.worldY);
      else if (arma == 'rafagas') this.poolBalasRafagas.shoot(x, y, this.pointer.worldX, this.pointer.worldY);
      else if (arma == 'rebotador') this.poolBalasRebotador.shoot(x, y, this.pointer.worldX, this.pointer.worldY);
      else if (arma == 'mortero') this.poolBalasMortero.shoot(x, y, this.pointer.worldX, this.pointer.worldY);
    }
    else {
      if (arma == 'disparoSimple') this.poolBalasSimples.spawn(x, y, destino.x, destino.y);
      else if (arma == 'rafagas') this.poolBalasRafagas.spawn(x, y, destino.x, destino.y);
      else if (arma == 'rebotador') this.poolBalasRebotador.spawn(x, y, destino.x, destino.y);
      else if (arma == 'mortero') this.poolBalasMortero.spawn(x, y, destino.x, destino.y);
    }

  }

  //devuelve la posicion del jugador
  canonPosition = function () {
    let pos = { x: this.player.x, y: this.player.y };
    return pos;
  }

  explosion(x, y) {

    this.explosionAudio.play();
    this.enviarSondio("explosion");
    this.socket.emit('explosion', { //avisa al segundo jugador de que se ha producido una explosion
      x: x,
      y: y,
    })

    new ExplosionAnim(this, x, y, 'animacion', this.player, this.player2); //crea la animacion de la explosion en el lugar dado
  }

  cambiarIconosArmas() {
    let textureP = this.iconoArmaPrincipal.texture; //guarda la texturas para luego invertirlas
    this.iconoArmaPrincipal.setTexture(this.iconoArmaSecundaria.texture.key);
    this.iconoArmaSecundaria.setTexture(textureP.key);
  }

  //se llama al disparar y resetea la barra de recarga
  triggerRechargeUI = function (time) {
    this.shootBar.displayWidth = 0;
    this.speedRechargeP1 = _c.settBarraRech.velocidadUIRecarga / time;
    this.shootBar.setTint(_c.settBarraRech.colorBarraCharged);
  }

  toggleShoot = function () {
    this.isShootable = true;
    this.recharging = false;
    this.shootBar.setTint(_c.settBarraRech.colorBarraNormal);
  }

  dealDmg = function (damage, player) { //metodo en el que recibes daño
    if (player == 1) {
      this.lifePlayer1 -= damage;

      if (this.lifePlayer1 <= 0) {
        this.lifePlayer2 = _c.settPlayer.vidaMax;
        this.lifePlayer1 = _c.settPlayer.vidaMax;
        this.socket.emit('finDeJuego', 0)
        this.socket.off('disparoJ2');        
        this.fondoAudio.stop();
        this.scene.start('derrota',this.socket);
      }
    }
    else {
      this.lifePlayer2 -= damage;

      if (this.lifePlayer2 <= 0) {
        this.lifePlayer2 = _c.settPlayer.vidaMax;
        this.lifePlayer1 = _c.settPlayer.vidaMax;
        this.socket.emit('finDeJuego', 1);
      }
    }
  }

  revive = function () { //se revive al juegador
    this.lifePlayer1 = _c.settPlayer.vidaMax;
    console.log('1up');
  }

  enviarSondio = function (sonido) {

    console.log("___sonido de: " + sonido + " enviado");
    socket.emit('sondio', sonido);
  }
}