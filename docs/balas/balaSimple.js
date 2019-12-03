import Bullet from './bullet.js'
export default class BalaSimple extends Bullet {
    constructor(scene, imag, vel, reb, paredes, pool, damage) {
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
            }
            else {
                pool.delete(this); //destruirse
                this.rebotesAcumulados = 0;
            }
        }, null, this); //añade las colisiones con los muros

    }

    preUpdate() {

    }
}
