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

    this.shootContainer = this.add.image(_c.settBarraRech.posicionContainer.x, _c.settBarraRech.posicionContainer.y, 'containerVida').setOrigin(0, 0);
    this.shootContainer.setDepth(10).setAngle(90).setTint(_c.settBarraRech.colorContainer);
    this.shootContainer.displayWidth = _c.settBarraRech.widthContainer;
    this.shootBar = this.add.image(_c.settBarraRech.posicionBarra.x, _c.settBarraRech.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9).setAngle(90).setTint(0x26ff00);
    this.shootBar.displayWidth = _c.settBarraRech.widthContainer - 11;
    this.speedRecharge = 0;

    this.lifeContainer = this.add.image(_c.settBarraVida.posicionContainer.x, _c.settBarraVida.posicionContainer.y, 'containerVida').setOrigin(0, 0).setDepth(10);
    this.lifeContainer.displayWidth = _c.settBarraVida.widthContainer;
    this.lifeBar = this.add.image(_c.settBarraVida.posicionBarra.x, _c.settBarraVida.posicionBarra.y, 'barraVida').setOrigin(0, 0).setDepth(9);
    this.lifeBar.displayWidth = _c.settBarraVida.widthContainer;


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

      this.actualizarBalasSimples(datos);
      this.actualizarBalasRafagas(datos);
      this.actualizarBalasRebotador(datos);
      this.actualizarBalasMortero(datos);
    })

    this.socket.on("explosion", datos => {
      this.activarExplosion(datos);
    })
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
}

