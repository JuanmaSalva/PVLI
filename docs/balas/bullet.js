export default class Bullet extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, imag) { //imag es el sprite que se va a cargar
        super(scene, 0, 0, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe
        this.scene.physics.add.existing(this); //le otorga presencia fisica
        this.body.setCollideWorldBounds(); //colisiona con los bordes de la partida
        this.setScale(1.5);
        this.body.setBounce(1,1);
    }

    preUpdate() {
    }


}


//TIENE QUE SER PROTOTYPE POR QUE LUEGO AL DESTRUIR LA BALA HAY Q ASIGNARLE LA FUNCION DE NUEVO
Bullet.prototype.direccion = function(x, y) { //le llega la posicion del raton y calcula su direccion
    this.direccion = [(x + 10 - this.x), (y + 10 - this.y)];
    let modulo = Math.sqrt((this.direccion[0] * this.direccion[0]) + (this.direccion[1] * this.direccion[1]))
    this.direccion[0] = this.direccion[0] / modulo;
    this.direccion[1] = this.direccion[1] / modulo;

    this.body.setVelocityY(this.direccion[1] * this.velocidad);
    this.body.setVelocityX(this.direccion[0] * this.velocidad); //se le da la velocidad a la bala

    this.x = this.x + (15*this.direccion[0]); //esto segun la bala cambia F
    this.y = this.y + (15*this.direccion[1]); //pone la bala en la punta del calñon

    this.angle = (Phaser.Math.Angle.Between(x + 10, y + 10, this.x, this.y) - Math.PI / 2);
    this.rotation = this.angle;  //pone la bala apuntando al raton
}