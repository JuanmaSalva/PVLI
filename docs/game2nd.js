import * as _c from './constantes.js'
import ExplosionAnim from './balas/explosion.js'

export default class Game extends Phaser.Scene { //es una escena
  constructor() {
    super({ key: 'game2nd' });

  }

  //es llamado cuando esta escne se carga
  init(data) {
    this.playerData = data; //la informacion de las armas seleccionadas
    this.iconoArmaPrincipal = this.add.image(32, 608, data.principal).setScale(0.7).setDepth(10);;
    this.iconoArmaSecundaria = this.add.image(85, 618, data.secundaria).setScale(0.45).setDepth(10);;
    this.socket = data.soc;
    this.arma = data.principal;
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
    this.load.image('blueTank', 'assets/blueTank.png');
    this.load.image('blueBarrel', 'assets/blueBarrel.png');
  } //cargar los recursos

  create() {
    this.input.setDefaultCursor('url(assets/icon.cur), pointer'); //cambio del cursor

    this.pointer = this.input.activePointer; //cursor del raton

    this.shootContainer = this.add.image(_c.settBarraRech.posicionContainer.x, _c.settBarraRech.posicionContainer.y, 'containerVida').setOrigin(0, 0);
    this.shootContainer.setDepth(10).setAngle(90).setTint(_c.settBarraRech.colorContainer);
    this.shootContainer.displayWidth = _c.settBarraRech.widthContainer;
    this.shootBar = this.add.image(_c.settBarraRech.posicionBarra.x, _c.settBarraRech.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9).setAngle(90).setTint(0x26ff00);
    this.shootBar.displayWidth = _c.settBarraRech.widthContainer - 11;
    this.speedRechargeP2 = 0;

    this.lifeContainer = this.add.image(_c.settBarraVida.posicionContainer.x, _c.settBarraVida.posicionContainer.y, 'containerVida').setOrigin(0, 0).setDepth(10);
    this.lifeContainer.displayWidth = _c.settBarraVida.widthContainer;
    this.lifeBar = this.add.image(_c.settBarraVida.posicionBarra.x, _c.settBarraVida.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9);
    this.lifeBar.displayWidth = _c.settBarraVida.widthContainer;

    this.input.on('pointerdown', pointer => { //creacion del evento de cuando se suelta el clic
      if (this.arma !== 'mortero' && this.arma != 'rafagas') this.disparar();
      else if (this.arma === 'rafagas') {
        this.disparar();
        this.time.delayedCall(_c.settBRaf.tiempoEntreBalas, this.shoot, [], this);
        this.time.delayedCall(_c.settBRaf.tiempoEntreBalas * 2, this.shoot, [], this);
      }
    })

    this.input.on('pointerup', pointer => { //creacion del evento de cuando se suelta el clic      
      if (this.arma === 'mortero' && this.circulo) this.circulo.destroy();
      if (this.arma === 'mortero' && pointer.leftButtonReleased()) this.disparar();
    })

    let map = this.make.tilemap({
      key: 'tilemap',
      tileWidth: 64,
      tileHeight: 64
    }); //se crea el tilemap

    let tileset = map.addTilesetImage('tilesDibujitosV2', 'patronesTilemap'); //se crea el tileset desde el tilesheet
    map.createStaticLayer("Background", tileset, 0, 0).setDepth(-2).setScale(0.5); //se crea el fondo desde el tileset
    map.createStaticLayer("Walls", tileset, 0, 0).setDepth(-1).setScale(0.5);  //Capa de las paredes
    map.createStaticLayer("Deco", tileset, 0, 0).setDepth(0).setScale(0.5);

    this.p1 = this.add.sprite(100, 100, 'tank');
    this.p1Canon = this.add.sprite(100, 100, 'redBarrel1').setOrigin(0.5, 0);

    this.p2 = this.add.sprite(100, 100, 'blueTank');
    this.p2Canon = this.add.sprite(100, 100, 'blueBarrel').setOrigin(0.5, 0);

    this.poolBalasSimples = [];
    this.poolBalasRafagas = []
    this.poolBalasRebotador = [];
    this.poolBalasMortero = [];

    this.balasSimplesActivas = 0;
    this.balasRafagasActivas = 0;
    this.balasRebotadorasActivas = 0;
    this.balasMorteroActivas = 0;

    for (let i = 0; i < _c.settBSimples.cantidadPool; i++) {
      this.poolBalasSimples.push(this.add.sprite(-50, -50, 'bala1').setScale(1.5).setDepth(-1));
    }
    for (let i = 0; i < _c.settBRaf.cantidadPool; i++) {
      this.poolBalasRafagas.push(this.add.sprite(-50, -50, 'bala1').setScale(1.5).setDepth(-1));
    }
    for (let i = 0; i < _c.settBRebot.cantidadPool; i++) {
      this.poolBalasRebotador.push(this.add.sprite(-50, -50, 'bala1').setScale(1.5).setDepth(-1));
    }
    for (let i = 0; i < _c.settBSimples.cantidadPool; i++) {
      this.poolBalasMortero.push(this.add.sprite(-50, -50, 'balaMortero').setScale(1.5).setDepth(0));
    }


    this.socket.on("update", datos => { //aqui llega todo (excepto explosiones)
      this.p1.x = datos.posJ1.x;
      this.p1.y = datos.posJ1.y;
      this.p1.angle = datos.rotJ1;
      this.p1Canon.x = datos.posJ1.x;
      this.p1Canon.y = datos.posJ1.y;
      this.p1Canon.angle = datos.rotCanJ1;

      this.p2.x = datos.posJ2.x;
      this.p2.y = datos.posJ2.y;
      this.p2.angle = datos.rotJ2;
      this.p2Canon.x = datos.posJ2.x;
      this.p2Canon.y = datos.posJ2.y;
      this.p2Canon.angle = datos.rotCanJ2;

      this.actualizarBalasSimples(datos);
      this.actualizarBalasRafagas(datos);
      this.actualizarBalasRebotador(datos);
      this.actualizarBalasMortero(datos);

      console.log(datos.lifePlayer2);
      this.lifeBar.displayWidth = datos.lifePlayer2 * _c.settBarraVida.escalaBarraA_Vida;
    })

    this.socket.on("explosion", datos => {
      this.activarExplosion(datos);
    })

    this.w = this.input.keyboard.addKey('W');
    this.a = this.input.keyboard.addKey('A');
    this.s = this.input.keyboard.addKey('S');
    this.d = this.input.keyboard.addKey('D');
    this.q = this.input.keyboard.addKey('Q');

    this.q.on('down', this.cambioArma, this);

    this._maxSpeed = _c.settPlayer2.velocidadMax;
    this.oldAngle = 0;
    this.angle2 = 0;

    this.isRecharging = false;
  }

  update() {

    let vel;
    let velX = 0;
    let velY = 0;

    this.dir = 0;
    this.angleObj = 0;

    if ((this.s.isDown || this.w.isDown) && (this.a.isDown || this.d.isDown)) vel = this._maxSpeed * 71 / 100;
    else vel = this._maxSpeed;
    if (this.w.isDown) {
      velY = -vel;
      this.angleObj += this.oldAngle = 0;
      this.dir += 1;
    } else if (this.s.isDown) {
      velY = vel;
      this.angleObj += this.oldAngle = 180;
      this.dir += 1;
    }

    if (this.a.isDown) {
      velX = -vel;
      this.angleObj += this.oldAngle = 270;
      this.dir += 1;
    } else if (this.d.isDown) {
      velX = vel;
      this.angleObj += this.oldAngle = 90;
      this.dir += 1;
    }

    if (this.angle2 = this.angleObj / (this.dir || 1)) { }
    else this.angle2 = this.oldAngle || 0;

    if (this.shootContainer.displayWidth > this.shootBar.displayWidth + _c.settBarraRech.margenWidth) {
      this.shootBar.displayWidth += this.speedRechargeP2;
    }

    this.socket.emit('updateP2', { //toda la info necesaria
      cursor: { x: this.pointer.worldX, y: this.pointer.worldY },
      velocidad: { x: velX, y: velY },
      angulo: this.angle2,
    });


    if (this.pointer.isDown && this.arma == 'mortero') {
      if (this.circulo) this.circulo.destroy();
      this.circulo = this.add.circle(this.p2.x, this.p2.y, _c.settBMortero.rango + _c.settBMortero.variabilidadRadioCirculo);
      this.circulo.setStrokeStyle(_c.settBMortero.anchoCirculoRango, _c.settBMortero.colorCirculoRango);
    }

  }

  actualizarBalasSimples = function (datos) {
    for (let i = 0; i < datos.balasSimple.length; i++) {
      this.poolBalasSimples[i].x = datos.balasSimple[i].x;
      this.poolBalasSimples[i].y = datos.balasSimple[i].y;
      this.poolBalasSimples[i].angle = datos.balasSimple[i].angle;
      if (i + 1 > this.balasSimplesActivas) this.balasSimplesActivas = i + 1;
    }


    for (let i = datos.balasSimple.length; i < this.balasSimplesActivas; i++) {
      this.poolBalasSimples[i].x = -50;
      this.poolBalasSimples[i].y = -50;
    }
    this.balasSimplesActivas = datos.balasSimple.length;
  }

  actualizarBalasRafagas = function (datos) {
    for (let i = 0; i < datos.balasRafagas.length; i++) {
      this.poolBalasRafagas[i].x = datos.balasRafagas[i].x;
      this.poolBalasRafagas[i].y = datos.balasRafagas[i].y;
      this.poolBalasRafagas[i].angle = datos.balasRafagas[i].angle;
      if (i + 1 > this.balasRafagasActivas) this.balasRafagasActivas = i + 1;
    }

    for (let i = datos.balasRafagas.length; i < this.balasRafagasActivas; i++) {
      this.poolBalasRafagas[i].x = -50;
      this.poolBalasRafagas[i].y = -50;
    }
    this.balasRafagasActivas = datos.balasRafagas.length;
  }

  actualizarBalasRebotador = function (datos) {
    for (let i = 0; i < datos.balasRebotadoras.length; i++) {
      this.poolBalasRebotador[i].x = datos.balasRebotadoras[i].x;
      this.poolBalasRebotador[i].y = datos.balasRebotadoras[i].y;
      this.poolBalasRebotador[i].angle = datos.balasRebotadoras[i].angle;
      if (i + 1 > this.balasRebotadorasActivas) this.balasRebotadorasActivas = i + 1;
    }

    for (let i = datos.balasRebotadoras.length; i < this.balasRebotadorasActivas; i++) {
      this.poolBalasRebotador[i].x = -50;
      this.poolBalasRebotador[i].y = -50;
    }
    this.balasRebotadorasActivas = datos.balasRebotadoras.length;
  }

  actualizarBalasMortero = function (datos) {
    for (let i = 0; i < datos.balasMortero.length; i++) {
      this.poolBalasMortero[i].x = datos.balasMortero[i].x;
      this.poolBalasMortero[i].y = datos.balasMortero[i].y;
      this.poolBalasMortero[i].angle = datos.balasMortero[i].angle;
      this.poolBalasMortero[i].scale = datos.balasMortero[i].scale;
      if (i + 1 > this.balasMorteroActivas) this.balasMorteroActivas = i + 1;
    }

    for (let i = datos.balasMortero.length; i < this.balasMorteroActivas; i++) {
      this.poolBalasMortero[i].x = -50;
      this.poolBalasMortero[i].y = -50;
    }
    this.balasMorteroActivas = datos.balasMortero.length;
  }

  activarExplosion = function (datos) {
    new ExplosionAnim(this, datos.x, datos.y, 'animacion'); //crea la animacion de la explosion en el lugar dado
  }

  cambioArma() {
    if (this.arma == this.playerData.principal) this.arma = this.playerData.secundaria;
    else this.arma = this.playerData.principal;
    let textureP = this.iconoArmaPrincipal.texture; //guarda la texturas para luego invertirlas
    this.iconoArmaPrincipal.setTexture(this.iconoArmaSecundaria.texture.key);
    this.iconoArmaSecundaria.setTexture(textureP.key);
  }


  shoot = function () {
    this.socket.emit('disparoP2', {
      x: this.p2Canon.x,
      y: this.p2Canon.y,
      arma: this.arma,
      destino: { x: this.pointer.worldX, y: this.pointer.worldY },
    });
  }


  disparar = function () {
    if (this.isRecharging == false) this.shoot();
    this.isRecharging = true;

    if (this.arma === "disparoSimple") {
      this.time.delayedCall(_c.settBSimples.cadencia, this.toggleRecharging, [], this);
      this.triggerRechargeUI(_c.settBSimples.cadencia);
    }
    else if (this.arma === "rafagas") {
      this.time.delayedCall(_c.settBRaf.cadencia, this.toggleRecharging, [], this);
      this.triggerRechargeUI(_c.settBRaf.cadencia);
    }
    else if (this.arma === "rebotador") {
      this.time.delayedCall(_c.settBRebot.cadencia, this.toggleRecharging, [], this);
      this.triggerRechargeUI(_c.settBRebot.cadencia);
    }
    else if (this.arma === "mortero") {
      this.time.delayedCall(_c.settBMortero.cadencia, this.toggleRecharging, [], this);
      this.triggerRechargeUI(_c.settBMortero.cadencia);
    }
  }


  toggleRecharging = function () {
    this.isShootable = true;
    this.isRecharging = false;
    this.shootBar.setTint(_c.settBarraRech.colorBarraNormal);
  };

  triggerRechargeUI = function (time) {
    this.shootBar.displayWidth = 0;
    this.speedRechargeP2 = _c.settBarraRech.velocidadUIRecarga / time;
    this.shootBar.setTint(_c.settBarraRech.colorBarraCharged);
  }

}

