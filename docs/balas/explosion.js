import * as _c from '../constantes.js'

export default class ExplosionAnim extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, x, y,imag, player) { //imag es el sprite que se va a cargar
        super(scene, x, y, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe
        this.scene.physics.add.existing(this); //le otorga presencia fisica
        scene.anims.create({
            key: 'explo',
            frames: scene.anims.generateFrameNumbers(imag, { start: 0, end: 9}),
            frameRate: _c.settBMortero.velocidadAnimacion,
            repeat: 0,
        });
        
        scene.physics.add.collider(player, this, function () { 
            scene.lifeBar.displayWidth = (player.dealDmg(_c.settBMortero.daño))* _c.settBarraVida.escalaBarraA_Vida;
        }, null, this); // colision con el jugador

        //MUY IMPORTANTE, ESCRIBIR COMPLETE BIEN Q SI TIENES DISLEXIA Y LO ESCRIBES MAL NO FUNCIONA
        this.on('animationcomplete',function(){
            this.destroy();
        });

        this.play('explo'); //le da a la animacion
    }
}