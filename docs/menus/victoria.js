export default class Victoria extends Phaser.Scene {
    constructor() {
        super({ key: 'victoria' });
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonmenu.png');
        this.load.image('fondoVictoria', 'assets/victoria.png');
    }

    create() {
        this.add.image(448, 320, 'fondoVictoria'); //fondo provisional
        this.boton = this.add.image(448, 350, 'botonInicio').setInteractive();

        this.boton.on('pointerdown', () => { //se le ha dado a jugar
            this.scene.start('menu');
        });
    }

}