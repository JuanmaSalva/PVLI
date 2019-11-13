import Bullet from './bullet.js'
export default class BalaSimple extends Bullet{
    constructor(scene,imag,vel,reb){
        super(scene,imag);
        this.velocidad = vel; //pone la velocidad del padre
        this.rebotes=reb;
    }
}