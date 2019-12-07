export default class Menu extends Phaser.Scene {
    constructor(t) {
        super({ key: 'menu' });
        //console.log(t);
    }

    init(socket){
        this.socket = socket;
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonStart.png');
        this.load.image('fondoInicio', 'assets/fondoMenu.png');
    }

    create() {
        this.fondo = this.add.image(448, 320, 'fondoInicio'); //fondo provisional
        this.boton = this.add.image(448, 268, 'botonInicio').setInteractive().setScale(0.5);
        this.boton.on('pointerdown', pointer => {
            this.scene.start('menuArmas',this.socket); //main = el key de la escena Game
        })
    }
}