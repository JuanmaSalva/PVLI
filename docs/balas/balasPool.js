import Bullet from './bullet.js'
import BulletSimple from './balaSimple.js'
import BulletRafaga from './rafaga.js'
import BulletRebotador from './balaRebotadora.js'
import BulletMortero from './mortero.js'

export default class Pool extends Phaser.GameObjects.Container {
    constructor(scene, paredes,player,imag, numElementosPool, arma, velocidad, aceleracion, numrebotes, cad, daño, rango) {
        super(scene); //llama al constructor de la clase por encima
        this.scena = scene;
        this.pointer = this.scene.input.activePointer; //cursor del raton

        let entities = []; //vector de balas
        for (let i = 0; i < numElementosPool; i++) {
            if (arma === 'disparosimple') entities.push(new BulletSimple(scene, imag, velocidad, numrebotes, paredes, this, 0, daño)); //creacion de las balas
            else if (arma === 'rafagas') entities.push(new BulletRafaga(scene, imag, velocidad, numrebotes, paredes, this, 0, daño)); //creacion de las balas
            else if (arma === 'rebotador') entities.push(new BulletRebotador(scene, imag, velocidad, numrebotes, paredes, this, aceleracion, daño)); //creacion de las balas
            else if (arma === 'mortero') entities.push(new BulletMortero(scene, imag, velocidad, this, daño, rango)); //creacion de las balas

            entities[i].x = entities[i].y = 50;
            entities[i].body.velocity.x = entities[i].body.velocity.y = 0;
            if(arma === 'mortero') entities[i].setDepth(1);
            else entities[i].setDepth(-1);
        }

        this.arma = arma;
        this.cadencia = cad; //se pone aqui por que todas las balas tienen la misma cadencia y no lo necesitan internamente
        this.rango = rango;
        this.isShootable = false;
        this.recharging = true; //empiezan del reves por q si no cuendo cambias de escene dispara ya de una
        this.scena.time.addEvent({ delay: 100, callback: toggleShoot, callbackScope: this });

        this._group = scene.add.group();
        this._group.addMultiple(entities); //se añaden todas las balas
        this._group.children.iterate(c => { //se duermen las balas
            c.setActive(false);
            c.setVisible(false);
        })

        this.scene.add.existing(this); //le dice a la scene Game que existe

        if(rango)scene.setRangeMortero(rango);
    }

    spawn = function (x, y) {
        let entity = this._group.getFirstDead();
        if (entity) { //la inicializa
            entity.x = x;
            entity.y = y;
            entity.setActive(true);
            entity.setVisible(true);
            entity.direccion(this.pointer.worldX, this.pointer.worldY);
        }
        return entity;
    }

    rafaga = function () {
        let pos = this.scena.canonPosition();
        this.spawn(pos[0], pos[1]); //dispara
    }
    
    shoot = function (x, y) {
        if (this.isShootable && !this.recharging) {
            this.spawn(x, y); //dispara
    
            if (this.arma == "rafagas") { //si el arma selecionada en rafagas hay un delay de 100 entre cada bala
                this.scena.time.delayedCall(100, this.rafaga, [], this)
                this.scena.time.delayedCall(200, this.rafaga, [], this)
            }
            else if(this.arma == "mortero"){
                
            }
    
            this.isShootable = false; //no puede dispara
    
            if (!this.recharging) {
                this.recharging = true;
                this.scena.time.addEvent({ delay: this.cadencia, callback: toggleShoot, callbackScope: this }) //llama al evento toggle pasado el tiempo de cadencia
            }
        }
    }

    delete = function (bala,isMortero) {
        let encontrado = false;
        let i = 0;
        while (!encontrado) {
            if (this._group.children[i] = bala) {
                encontrado = true;
                this._group.children[i].setActive(false);
                this._group.children[i].setVisible(false);
    
                this._group.children[i].x = this._group.children[i].y = 50;
                this._group.children[i].body.velocity.x = this._group.children[i].body.velocity.y = 0;
    
                if(isMortero) this._group.children[i].direccion = BulletMortero.prototype.direccion; //si no se pone esto la funcion de direccion deja de funcionar
                else this._group.children[i].direccion = Bullet.prototype.direccion; //si no se pone esto la funcion de direccion deja de funcionar
            }
    
            i++;
        }
    }
}

function toggleShoot() {
    this.isShootable = true;
    this.recharging = false;
}