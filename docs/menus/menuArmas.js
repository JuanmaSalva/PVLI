export default class MenuArmas extends Phaser.Scene {
    constructor() {
        super({ key: 'menuArmas' });
    }

    init(socket){
        this.socket=socket;
    }

    preload() {
        this.load.image('fondoArmas', 'assets/menuArmas.png');
        this.load.image('disparoSimple' , 'assets/iconoSimple.png');
        this.load.image('rafagas', 'assets/iconoRafagas.png' );
        this.load.image('rebotador', 'assets/iconoRebotador.png' );
        this.load.image('mortero', 'assets/iconoMortero.png' );
        this.load.image('iconoSeleccion', 'assets/iconoSeleccionado.png');
    }


    create(){
        this.fondo = this.add.image(448,320,'fondoArmas'); //fondo provisional
        this.botonSimple =  this.add.image(325,292, 'disparoSimple').setInteractive();
        this.botonRafagas =  this.add.image(325,464, 'rafagas').setInteractive();
        this.botonRebotador =  this.add.image(608,292, 'rebotador').setInteractive();
        this.botonMortero =  this.add.image(608,464, 'mortero').setInteractive();
        this.boton =  this.add.image(470,580, 'botonInicio').setInteractive().setScale(0.5);
        this.seleccionPrincipal = this.add.image(-50,-50,'iconoSeleccion');
        this.seleccionSecundaria = this.add.image(-50,-50,'iconoSeleccion');

        let armaPrincipalSeleccionada = "";
        let armaSecundariaSeleccionada = "" //si estan en -1 es que no estan seleccionadas

        this.botonSimple.on('pointerdown', pointer =>{
            armaPrincipalSeleccionada = "disparoSimple";
            this.seleccionPrincipal.x = this.botonSimple.x;
            this.seleccionPrincipal.y = this.botonSimple.y;
        })

        this.botonRafagas.on('pointerdown', pointer =>{
            armaPrincipalSeleccionada = "rafagas";
            this.seleccionPrincipal.x = this.botonRafagas.x;
            this.seleccionPrincipal.y = this.botonRafagas.y;
        })

        this.botonRebotador.on('pointerdown', pointer =>{
            armaSecundariaSeleccionada = "rebotador";
            this.seleccionSecundaria.x = this.botonRebotador.x;
            this.seleccionSecundaria.y = this.botonRebotador.y;
        })

        this.botonMortero.on('pointerdown', pointer =>{
            armaSecundariaSeleccionada = "mortero";
            this.seleccionSecundaria.x = this.botonMortero.x;
            this.seleccionSecundaria.y = this.botonMortero.y;
        })

        
        this.boton.on('pointerdown', pointer =>{
            if(armaPrincipalSeleccionada != "" && armaSecundariaSeleccionada != "") this.scene.start('main',{principal:armaPrincipalSeleccionada,secundaria:armaSecundariaSeleccionada, soc:this.socket}); //main = el key de la escena Game
        })
    }

}