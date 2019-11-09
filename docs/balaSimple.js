import Bullet from './bullet.js'
export default class BalaSimple extends Bullet{
    constructor(scene,imag,vel,rebotes){
        super(scene,imag);
        this.velocidad = vel; //pone la velocidad del padre
    }
}