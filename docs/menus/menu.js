export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });
    }

    init(data){
        this.socket = data.s;
        this.numPlayer = data.numP;
    }

    preload() {
        this.load.image('botonPlay', 'assets/botonplay.png');
        this.load.image('fondoInicio', 'assets/fondoMenu.png');

        this.load.audio('click', 'assets/menuclick.wav');
    }

    create() {
        this.clickAudio = this.sound.add('click');
        this.add.image(448, 320, 'fondoInicio'); //fondo provisional
        this.boton = this.add.image(448, 268, 'botonPlay').setInteractive().setScale(0.7);
        this.boton.on('pointerdown', () => { //se le ha dado a jugar
            this.clickAudio.play();
            this.socket.emit('numeroDeJugadores', this.numPlayer);

            this.socket.on('numeroDeJugadores', numero => {
                if(numero == 2)this.scene.start('menuArmas',{s:this.socket, numP:this.numPlayer}); //main = el key de la escena Game
            })            
        })
    }
}