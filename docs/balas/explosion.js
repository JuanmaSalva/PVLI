import * as _c from '../constantes.js'

export default class ExplosionAnim extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, x, y, imag, player, player2) { //imag es el sprite que se va a cargar
        super(scene, x, y, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe

        this.boolDaño = { p1: 1, p2: 1 };  //si ha dañado al jugador  1-> no      0->si
        if (this.scene.physics != undefined) {  //PARA EL JUGADOR 1 SOLO
            this.scene.physics.add.existing(this); //le otorga presencia fisica
            this.body.setCircle(_c.settBMortero.radioHitboxExplosion, 32 - _c.settBMortero.radioHitboxExplosion, 32 - _c.settBMortero.radioHitboxExplosion);  //_c.settBMortero.offsetHitboxExplosion.x, _c.settBMortero.offsetHitboxExplosion.y);
            this.body.immovable = true;

            scene.physics.add.collider(player, this, function () {
                scene.dealDmg(_c.settBMortero.daño * this.boolDaño.p1, 1);
                this.boolDaño.p1 = 0;
            }, null, this); // colision con el jugador    

            scene.physics.add.collider(player2, this, function () {
                scene.dealDmg(_c.settBMortero.daño * this.boolDaño.p2, 2);
                this.boolDaño.p2 = 0;
            }, null, this); // colision con el jugador 
        }

        scene.anims.create({
            key: 'explo',
            frames: scene.anims.generateFrameNumbers(imag, { start: 0, end: 9 }),
            frameRate: _c.settBMortero.velocidadAnimacion,
            repeat: 0,
        });
        

        //MUY IMPORTANTE, ESCRIBIR COMPLETE BIEN Q SI TIENES DISLEXIA Y LO ESCRIBES MAL NO FUNCIONA
        this.on('animationcomplete', function () {
            this.destroy();
        });

        this.play('explo'); //le da a la animacion
    }
}