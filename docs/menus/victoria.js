export default class Victoria extends Phaser.Scene {
    constructor() {
        super({ key: 'victoria' });
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonStart.png');
        this.load.image('fondoVictoria', 'assets/victoria.png');
    }

    create() {
        this.add.image(448, 320, 'fondoVictoria'); //fondo provisional
        this.boton = this.add.image(448, 268, 'botonInicio').setInteractive().setScale(0.5);

        this.boton.on('pointerdown', pointer => { //se le ha dado a jugar
            this.scene.start('menu');
        });
    }

}