import Bullet from './bullet.js'
export default class BalaRebotadora extends Bullet {
    constructor(scene, imag, vel, reb, paredes, pool, aceleracion, damage) {
        super(scene, imag);
        this.velocidad = vel; //pone la velocidad del padre
        this.rebotesAcumulados = 0;
        this.daño = damage;
        this.body.setCircle(2, 0, 3);

        scene.physics.add.collider(paredes, this, function () {

            this.rebotesAcumulados++;
            if (this.rebotesAcumulados <= reb) {
                let angle = (Phaser.Math.Angle.Between(this.x, this.y, this.x + this.body.velocity.x, this.y + this.body.velocity.y) - Math.PI / 2);
                this.rotation = angle;  //pone la bala apuntando al raton

                this.daño += this.daño/5; //cada vez que rebota su daño aumenta en un 20% (GDD)
                this.velocidad += aceleracion;

                let modulo = Math.sqrt((this.body.velocity.x * this.body.velocity.x) + (this.body.velocity.y * this.body.velocity.y)); //calculo del modulo de la direccion

                this.direccion[0] = this.body.velocity.x / modulo; //lo manda en la misma direccion pero con una velocidad acelerada
                this.direccion[1] = this.body.velocity.y / modulo;

                this.body.setVelocityX(this.direccion[0] * this.velocidad); //se le da la velocidad a la bala
                this.body.setVelocityY(this.direccion[1] * this.velocidad);
            }
            else {
                pool.delete(this); //destruirse
                this.velocidad = vel;
                this.rebotesAcumulados = 0;
            }
        }, null, this); //añade las colisiones con los muros

    }

    preUpdate() {

    }
}
