export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });
    }

    init(data){
        this.socket = data.s;
        this.numPlayer = data.numP;
    }

    preload() {
        this.load.image('botonInicio', 'assets/botonStart.png');
        this.load.image('fondoInicio', 'assets/fondoMenu.png');
    }

    create() {
        this.add.image(448, 320, 'fondoInicio'); //fondo provisional
        this.boton = this.add.image(448, 268, 'botonInicio').setInteractive().setScale(0.5);
        this.boton.on('pointerdown', pointer => { //se le ha dado a jugar
            this.socket.emit('numeroDeJugadores', this.numPlayer);

            this.socket.on('numeroDeJugadores', numero => {
                if(numero == 2)this.scene.start('menuArmas',{s:this.socket, numP:this.numPlayer}); //main = el key de la escena Game
            })            
        })
    }
}