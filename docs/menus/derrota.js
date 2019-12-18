export default class Derrota extends Phaser.Scene {
    constructor() {
        super({ key: 'derrota' });
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonmenu.png');
        this.load.image('fondoDerrota', 'assets/derrota.png');
        
        this.load.audio('click', 'assets/menuclick.wav');
    }

    create() {
        this.clickAudio = this.sound.add('click');
        this.add.image(448, 320, 'fondoDerrota'); //fondo provisional
        this.boton = this.add.image(448, 350, 'botonInicio').setInteractive();

        this.boton.on('pointerdown', () => { //se le ha dado a jugar
            this.clickAudio.play();
            this.scene.start('menu');
        });
    }
}