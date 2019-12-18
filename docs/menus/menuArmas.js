export default class MenuArmas extends Phaser.Scene {
    constructor() {
        super({ key: 'menuArmas' });
    }

    init(data) {
        this.socket = data.s;
        this.numPlayer = data.numP;
        this.armaPrincipalSeleccionada = "";
        this.armaSecundariaSeleccionada = "" //si estan en -1 es que no estan seleccionadas
    }

    preload() {
        this.load.image('botonStart', 'assets/botonstart.png')
        this.load.image('fondoArmas', 'assets/menuArmas.png');
        this.load.image('disparoSimple', 'assets/iconoSimple.png');
        this.load.image('rafagas', 'assets/iconoRafagas.png');
        this.load.image('rebotador', 'assets/iconoRebotador.png');
        this.load.image('mortero', 'assets/iconoMortero.png');
        this.load.image('iconoSeleccion', 'assets/iconoSeleccionado.png');
        this.load.image('waiting', 'assets/botonwaiting.png');

        this.load.audio('click', 'assets/menuclick.wav');
    }


    create() {
        this.fondo = this.add.image(448, 320, 'fondoArmas'); //fondo provisional
        this.botonSimple = this.add.image(298, 292, 'disparoSimple').setInteractive();
        this.botonRafagas = this.add.image(298, 464, 'rafagas').setInteractive();
        this.botonRebotador = this.add.image(598, 292, 'rebotador').setInteractive();
        this.botonMortero = this.add.image(598, 464, 'mortero').setInteractive();
        this.boton = this.add.image(448, 580, 'botonStart').setInteractive().setScale(0.5);
        this.seleccionPrincipal = this.add.image(-50, -50, 'iconoSeleccion');
        this.seleccionSecundaria = this.add.image(-50, -50, 'iconoSeleccion');
        this.waiting = false;

        this.clickAudio = this.sound.add('click');
        this.botonSimple.on('pointerdown', () => {
            this.clickAudio.play();
            this.armaPrincipalSeleccionada = "disparoSimple";
            this.seleccionPrincipal.x = this.botonSimple.x;
            this.seleccionPrincipal.y = this.botonSimple.y;
        })

        this.botonRafagas.on('pointerdown', () => {
            this.clickAudio.play();
            this.armaPrincipalSeleccionada = "rafagas";
            this.seleccionPrincipal.x = this.botonRafagas.x;
            this.seleccionPrincipal.y = this.botonRafagas.y;
        })

        this.botonRebotador.on('pointerdown', () => {
            this.clickAudio.play();
            this.armaSecundariaSeleccionada = "rebotador";
            this.seleccionSecundaria.x = this.botonRebotador.x;
            this.seleccionSecundaria.y = this.botonRebotador.y;
        })

        this.botonMortero.on('pointerdown', () => {
            this.clickAudio.play();
            this.armaSecundariaSeleccionada = "mortero";
            this.seleccionSecundaria.x = this.botonMortero.x;
            this.seleccionSecundaria.y = this.botonMortero.y;
        })

        this.socket.on('respuestaJugadoresEsperando', comienzo => {
            if (comienzo) {
                this.waiting = false;
                if (this.numPlayer == 0) this.scene.start('main', { principal: this.armaPrincipalSeleccionada, secundaria: this.armaSecundariaSeleccionada, soc: this.socket, numPlayer: this.numPlayer });
                else this.scene.start('game2nd', { principal: this.armaPrincipalSeleccionada, secundaria: this.armaSecundariaSeleccionada, soc: this.socket, numPlayer: this.numPlayer });
            }
            else console.log("Esperando a otro jugador para empezar la partida");
        })

        this.boton.on('pointerdown', () => {
            this.clickAudio.play();
            if (this.armaPrincipalSeleccionada != "" && this.armaSecundariaSeleccionada != "" && !this.waiting) {
                this.waiting = true;
                this.add.image(448,375, 'waiting');
                this.socket.emit("empezar", this.numPlayer); //avisa al server de que hay un juegador esprando
            };
        })
    }
}