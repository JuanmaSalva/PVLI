import Bullet from './bullet.js'
import BulletSimple from './balaSimple.js'

export default class Pool extends Phaser.GameObjects.Container {
    constructor(scene,paredes,imag,numElementosPool, arma,velocidad,aceleracion,numrebotes, cad) {        
        super(scene); //llama al constructor de la clase por encima
        this.scena=scene;
        this.pointer = this.scene.input.activePointer; //cursor del raton

        let entities = []; //vector de balas
        for(let i=0;i<numElementosPool;i++){
            if(arma == 'disparosimple') {                
                entities.push(new BulletSimple(scene,imag,velocidad,numrebotes)); //creacion de las balas
            }
        } 

        scene.physics.add.collider(paredes, entities, onCollision); //añade las colisiones con los muros

        this.cadencia = cad; //se pone aqui por que todas las balas tienen la misma cadencia y no lo necesitan internamente
        this.isShootable = false;
        this.recharging = true; //empiezan del reves por q si no cuendo cambias de escene dispara ya de una
        this.scena.time.addEvent({delay:100, callback: toggleShoot, callbackScope: this});

        this._group = scene.add.group();
        this._group.addMultiple(entities); //se añaden todas las balas
        this._group.children.iterate(c => { //se duermen las balas
            c.setActive(false);
            c.setVisible(false);
        })

        this.scene.add.existing(this); //le dice a la scene Game que existe
    }
}

function onCollision(){
    //lega la colision
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

Pool.prototype.shoot = function (x,y) {
    if(this.isShootable && !this.recharging){
        this.spawn(x,y); //dispara
        this.isShootable=false; //no puede dispara
        if(!this.recharging){
            this.recharging = true;
            this.scena.time.addEvent({delay:this.cadencia, callback: toggleShoot, callbackScope: this}) //llama al evento toggle pasado el tiempo de cadencia
        }
    }
}

function toggleShoot(){
    this.isShootable = true;
    this.recharging = false;
}