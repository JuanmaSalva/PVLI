import Bullet from './bullet.js'
import * as _c from '../constantes.js'
export default class BalaRafaga extends Bullet {
    constructor(scene, imag, vel, reb, paredes, pool, damage, player, player2) {
        super(scene, imag);
        this.velocidad = vel; //pone la velocidad del padre
        this.daño = damage;

        scene.physics.add.collider(paredes, this, function () {
            pool.delete(this, false); //destruirse           
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