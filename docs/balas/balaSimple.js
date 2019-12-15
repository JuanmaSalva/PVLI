import Bullet from './bullet.js'
import * as _c from '../constantes.js'
export default class BalaSimple extends Bullet {
    constructor(scene, imag, vel, reb, paredes, pool, damage, player, player2) {
        super(scene, imag);
        this.velocidad = vel; //pone la velocidad del padre
        this.rebotesAcumulados = 0;
        this.daño = damage;

        scene.physics.add.collider(paredes, this, function () {

            this.rebotesAcumulados++;
            if (this.rebotesAcumulados <= reb) {
                let angle = (Phaser.Math.Angle.Between(this.x, this.y, this.x + this.body.velocity.x, this.y + this.body.velocity.y) - Math.PI / 2);
                this.rotation = angle;  //pone la bala apuntando al raton
            }
            else {
                pool.delete(this, false); //destruirse
                this.rebotesAcumulados = 0;
            }
        }, null, this); //añade las colisiones con los muros

        scene.physics.add.collider(player, this, function () {
            scene.dealDmg(damage, 1);
            this.rebotesAcumulados = 0;
            pool.delete(this, false);
        }, null, this); // colision con el jugador

        scene.physics.add.collider(player2, this, function () {
            scene.dealDmg(damage, 2);
            this.rebotesAcumulados = 0;
            pool.delete(this, false);
        }, null, this); // colision con el jugador

    }

    preUpdate() {

    }
}
