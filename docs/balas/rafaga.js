import Bullet from './bullet.js'
import * as _c from '../constantes.js'
export default class BalaRafaga extends Bullet {
    constructor(scene, imag, vel, reb, paredes, pool, damage, player) {
        super(scene, imag);
        this.velocidad = vel; //pone la velocidad del padre
        this.daño = damage;

        console.log(player);

        scene.physics.add.collider(paredes, this, function () {
            pool.delete(this, false); //destruirse           
        }, null, this); //añade las colisiones con los muros

        scene.physics.add.collider(player, this, function () {
            scene.lifeBar.displayWidth = (player.dealDmg(damage)) * _c.settBarraVida.escalaBarraA_Vida - _c.settBarraVida.margenWidth;
            this.rebotesAcumulados = 0;
            pool.delete(this, false);
        }, null, this); // colision con el jugador

    }

    preUpdate() {

    }
}