export default class Derrota extends Phaser.Scene {
    constructor() {
        super({ key: 'derrota' });
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonStart.png');
        this.load.image('fondoDerrota', 'assets/derrota.png');
    }

    create() {
        this.add.image(448, 320, 'fondoDerrota'); //fondo provisional
        this.boton = this.add.image(448, 268, 'botonInicio').setInteractive().setScale(0.5);

        this.boton.on('pointerdown', pointer => { //se le ha dado a jugar
            this.scene.start('menu');
        });
    }
}