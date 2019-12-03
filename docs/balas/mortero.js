export default class BalaMortero extends Phaser.GameObjects.Sprite {
    constructor(scene, imag, vel, pool, damage, rango) {
        super(scene, 0, 0, imag);
        this.scene.add.existing(this); //le dice a la scene Game que existe
        this.scene.physics.add.existing(this); //le otorga presencia fisica
        this.velocidadIni = vel;
        this.velocidad = vel;
        this.rebotesAcumulados = 0;
        this.daño = damage;
        this.rango = rango;
        this.setScale(0.5);
        this.setDepth(0);
        this.pool = pool;
        this.scene = scene;

        this.isMoving = false;
        this.medio = false;

        this.escalaInicial = 1
        this.scala = this.escalaInicial;
    }

    preUpdate() {
        if (this.isMoving){
            if (!this.medio) {
                this.scala = this.scala + 0.1;
                this.setScale(this.scala);
                if ((this.direccion[1] > 0 && this.y > this.puntoMedio[1]) || (this.direccion[1] < 0 && this.y < this.puntoMedio[1])
                || (this.direccion[0] > 0 && this.x > this.puntoMedio[0]) && (this.direccion[0] < 0 && this.x < this.puntoMedio[0])) this.medio = true;
            }
            else {
                this.scala = this.scala - 0.1;
                this.setScale(this.scala);
                if (this.scala<this.escalaInicial) {

                    //reset de todos los valores necesarios para que esto no se mame
                    this.isMoving = false;
                    this.medio = false;
                    this.velocidad = this.velocidadIni;
                    this.scala=this.escalaInicial;

                    this.scene.explosion(this.x, this.y);
                    this.pool.delete(this, true); //destruirse
                    
                }
            }
        }
    }
}

BalaMortero.prototype.direccion = function (x, y) { //le llega la posicion del raton y calcula su direccion
    this.direccion = [(x + 10 - this.x), (y + 10 - this.y)];
    let modulo = Math.sqrt((this.direccion[0] * this.direccion[0]) + (this.direccion[1] * this.direccion[1]))
    this.direccion[0] = this.direccion[0] / modulo;
    this.direccion[1] = this.direccion[1] / modulo;

    //DESTINO
    this.distancia = Phaser.Math.Distance.Between(x, y, this.x, this.y);
    if (this.distancia > this.rango) this.distancia = this.rango; //si se sale del rango lo capa

    this.puntoFin = [this.x + this.direccion[0] * this.distancia, this.y + this.direccion[1] * this.distancia];
    //VELOCIDAD
    this.velocidad = (this.distancia/(this.velocidad/1000))
    this.body.setVelocityY(this.direccion[1] * this.velocidad);
    this.body.setVelocityX(this.direccion[0] * this.velocidad); //se le da la velocidad a la bala

    //ROTACION
    this.x = this.x + (15 * this.direccion[0]);
    this.y = this.y + (15 * this.direccion[1]); //pone la bala en la punta del calñon
    this.angle = (Phaser.Math.Angle.Between(x + 10, y + 10, this.x, this.y) - Math.PI / 2);
    this.rotation = this.angle;  //pone la bala apuntando al raton

console.log()

    this.puntoMedio = [(this.x + this.puntoFin[0]) / 2, (this.y + this.puntoFin[1]) / 2];
    this.isMoving = true;
} 