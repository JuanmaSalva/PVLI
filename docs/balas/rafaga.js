import Bullet from './bullet.js'
export default class BalaRafaga extends Bullet {
    constructor(scene, imag, vel, reb, paredes, pool, damage) {
        super(scene, imag);
        this.velocidad = vel; //pone la velocidad del padre
        this.daño = damage;

        scene.physics.add.collider(paredes, this, function () {
            pool.delete(this,false); //destruirse           
        }, null, this); //añade las colisiones con los muros

    }

    preUpdate() {

    }
}