import * as _c from '../constantes.js'

export default class Canon2 extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, imag, parent) { //imag es el sprite que se va a cargar
        super(scene, 0, -1, imag); //llama al constructor de la clase por encima
        scene.add.existing(this); //le dice a la scene Game que existe
    }
}