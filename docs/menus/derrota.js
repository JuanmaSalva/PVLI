export default class Derrota extends Phaser.Scene {
    constructor() {
        super({ key: 'derrota' });
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonmenu.png');
        this.load.image('fondoDerrota', 'assets/derrota.png');
    }

    create() {
        this.add.image(448, 320, 'fondoDerrota'); //fondo provisional
        this.boton = this.add.image(448, 350, 'botonInicio').setInteractive();

        this.boton.on('pointerdown', () => { //se le ha dado a jugar
            this.scene.start('menu');
        });
    }
}