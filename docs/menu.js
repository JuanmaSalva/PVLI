export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });

    }

    preload() {
        this.load.image('botonInicio', 'assets/botonStart.png');
    }
    
    create(){
        this.boton =  this.add.image(450,300, 'botonInicio').setInteractive();
        this.boton.on('pointerdown', pointer =>{
            this.scene.start('main'); //main = el key de la escena Game
        })
    }

}