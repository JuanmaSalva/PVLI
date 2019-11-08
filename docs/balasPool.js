import Bullet from './bullet.js'

export default class Pool extends Phaser.GameObjects.Container {
    constructor(scene,imag,numElementosPool) {        
        super(scene); //llama al constructor de la clase por encima
        
        this.pointer = this.scene.input.activePointer; //cursor del raton

        let entities = []; //vector de balas
        for(let i=0;i<numElementosPool;i++) entities.push(new Bullet(scene, imag)); //creacion de las balas

        this._group = scene.add.group();
        this._group.addMultiple(entities); //se añaden todas las balas
        this._group.children.iterate(c => { //se duermen las balas
            c.setActive(false);
            c.setVisible(false);
        })

        this.scene.add.existing(this); //le dice a la scene Game que existe
    }
}

Pool.prototype.spawn = function (x,y) {
    var entity = this._group.getFirstDead();
    if (entity) { //la inicializa
      entity.x = x;
      entity.y = y;
      entity.setActive(true);
      entity.setVisible(true);
      entity.direccion(this.pointer.worldX, this.pointer.worldY);
    }
    return entity;
}