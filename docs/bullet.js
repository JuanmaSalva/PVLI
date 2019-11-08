export default class Bullet extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, imag) { //imag es el sprite que se va a cargar
        super(scene, 0, 0, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe
        this.scene.physics.add.existing(this); //le otorga presencia fisica
        this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida
        this.setScale(1.5);

        //variables generales
        this.direccion;
        this.velocidad = 400;
        this.aceleracion;
    }

    preUpdate() {

        this.body.setVelocityY(this.direccion[1] * this.velocidad);
        this.body.setVelocityX(this.direccion[0] * this.velocidad);

        //LAS COLISIONES HAY Q DETECTARLAS CON OVERLAP
    }

    direccion(x, y) { //le llega la posicion del raton y calcula su direccion

        this.direccion = [(x + 10 - this.x), (y + 10 - this.y)];
        let modulo = Math.sqrt((this.direccion[0] * this.direccion[0]) + (this.direccion[1] * this.direccion[1]))
        this.direccion[0] = this.direccion[0] / modulo;
        this.direccion[1] = this.direccion[1] / modulo;

        this.angle = (Phaser.Math.Angle.Between(x + 10, y + 10, this.x, this.y) - Math.PI / 2);
        this.rotation = this.angle;


    }
}
