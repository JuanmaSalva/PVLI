import * as _c from '../constantes.js'

export default class Player2 extends Phaser.GameObjects.Container { //es un container
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene.add.existing(this); //le dice a la scene Game que existe
    this.scene.physics.add.existing(this); //le otorga presencia fisica
    this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida
    this.body.setCircle(_c.settPlayer.tamañoHitbox, -_c.settPlayer.tamañoHitbox, -_c.settPlayer.tamañoHitbox);
    this._maxSpeed = _c.settPlayer.velocidadMax;
    this.speed = this._maxSpeed;
    this._maxLife = _c.settPlayer.vidaMax;
    this.life = this._maxLife;

    this.armaPrincipal;
    this.armaSecundaria;
    this.armaSeleccionada = true;//true=principal, false=secundaria
  }
}