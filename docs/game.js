export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('ey', 'favicon.png');
    this.load.image('fondo', 'fondo.png');
    this.load.image('ground', 'platform.png');
  } //cargar los recursos

  create() {
    this.add.image(0, 0, 'fondo').setOrigin(0, 0).setScale(1.4);

    let platforms;

    platforms = this.physics.add.staticGroup(); //crea un "objeto vacio" statico

    platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //crea la base y el refrech sirve para actualizar su collider

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground'); //crea las plataformas hijas del grupo


    let player = this.physics.add.sprite(100, 450, 'ey');  //crea al personaje usando físicas

    player.setBounce(0.2); //le da un reboto el personaje
    player.setCollideWorldBounds(true); //impide que el personaje salga de la pantalla

    player.body.setGravityY(300); //le da gravedad al personaje

    this.physics.add.collider(player, platforms); //añade colisiones entre el grupo de plataformas y el personaje


    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }//inicializa todo

  update() {

    if (this.cursorKeys.left.isDown)
    {
        this.player.setVelocityX(-160);
    }
    else if (this.cursorKeys.right.isDown)
    {
        player.setVelocityX(160);
    }/*
    else
    {
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }*/
  }
}