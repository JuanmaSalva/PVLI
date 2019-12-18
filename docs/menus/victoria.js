export default class Victoria extends Phaser.Scene {
    constructor() {
        super({ key: 'victoria' });
    }

    init(soc) {
        this.socket = soc;
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonmenu.png');
        this.load.image('fondoVictoria', 'assets/victoria.png');

        this.load.audio('click', 'assets/menuclick.wav');
    }

    create() {
        this.clickAudio = this.sound.add('click');
        this.add.image(448, 320, 'fondoVictoria'); //fondo provisional
        this.boton = this.add.image(448, 350, 'botonInicio').setInteractive();

        this.boton.on('pointerdown', () => { //se le ha dado a jugar
            this.clickAudio.play();
            this.socket.emit('jugadorAMenu');
            this.scene.start('menu');
        });
    }

}