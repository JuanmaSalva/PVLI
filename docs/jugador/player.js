import * as _c from '../constantes.js'

export default class Player extends Phaser.GameObjects.Container { //es un container
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene.add.existing(this); //le dice a la scene Game que existe
    this.scene.physics.add.existing(this); //le otorga presencia fisica
    this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida
    this.body.setCircle(_c.settPlayer.tamañoHitbox, -_c.settPlayer.tamañoHitbox, -_c.settPlayer.tamañoHitbox);
    this._maxSpeed = _c.settPlayer.velocidadMax;
    this.speed = _c.settPlayer.velocidadMax;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.scena = scene;
    this._maxLife = _c.settPlayer.vidaMax;
    this.life = this._maxLife;

    this.armaPrincipal;
    this.armaSecundaria;
    this.armaSeleccionada = true;//true=principal, false=secundaria

    this.u = scene.input.keyboard.addKey('U'); //teclas provisionales para la vida en ui
    this.j = scene.input.keyboard.addKey('J');
    this.k = scene.input.keyboard.addKey('K');

    this.w = scene.input.keyboard.addKey('W');
    this.a = scene.input.keyboard.addKey('A');
    this.s = scene.input.keyboard.addKey('S');
    this.d = scene.input.keyboard.addKey('D');
    this.q = scene.input.keyboard.addKey('Q');


    this.dealDmg = function (damage) { //metodo en el que recibes daño
      this.life -= damage;

      if (this.life >= 0 && this.life <= this._maxLife) {
        console.log('Vida: ' + this.life);
      } else if (this.life <= 0) {
        this.life = 0;
        console.log('Murio wey');
      }else this.life = this._maxLife;
    }
    this.revive = function () { //se revive al juegador
      this.life = this._maxLife;
      console.log('1up');
    }

    let q = scene.input.keyboard.addKey('Q');  //boton de cambio de arma
    q.on('down', this.cambioArma, this);
  }

  preUpdate() {
    if ((this.cursors.up.isDown || this.cursors.down.isDown || this.s.isDown || this.w.isDown) && (this.cursors.left.isDown || this.cursors.right.isDown || this.s.isDown || this.w.isDown)) this.speed = this._maxSpeed * 71 / 100;
    else this.speed = this._maxSpeed;
    if (this.cursors.up.isDown || this.w.isDown) {
      this.body.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown || this.s.isDown) {
      this.body.setVelocityY(this.speed);
    } else this.body.setVelocityY(0);

    if (this.cursors.left.isDown || this.a.isDown) {
      this.body.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown || this.d.isDown) {
      this.body.setVelocityX(this.speed);
    } else this.body.setVelocityX(0);

    if (this.b.isDown) {
      this.arma = this.armas[0];
    }//PROVISIONAL
    else if (this.n.isDown) {
      this.arma = this.armas[1];
    }//PROVISIONAL
    else if (this.m.isDown) {
      this.arma = this.armas[2];
    }   //PROVISIONAL

    if (this.u.isDown) this.dealDmg(-1);//PROVISIONAL
    else if (this.j.isDown) this.dealDmg(1);//PROVISIONAL
    else if (this.k.isDown) this.revive();//PROVISIONAL

    
    this.scena.lifeBar.displayWidth = this.life*1.6;
  }

  spawnBala = function (arma) {
    this.scena.spawnBala(this.x, this.y, arma);
  }

  setArmas(p, s) {
    this.armaPrincipal = p;
    this.armaSecundaria = s;
    this.canon.setArma(this.armaPrincipal); //siempre empieza con el arma principal
  }

  cambioArma() {
    if (this.armaSeleccionada) { //cambia de arma segun la que tiene seleccionada el jugador
      this.armaSeleccionada = false;
      this.canon.setArma(this.armaSecundaria);
    }
    else {
      this.armaSeleccionada = true;
      this.canon.setArma(this.armaPrincipal);
    }
      this.scena.cambiarIconosArmas();
  }
}