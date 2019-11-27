export default class ExplosionAnim extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, x, y,imag) { //imag es el sprite que se va a cargar
        super(scene, x, y, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe
        scene.anims.create({
            key: 'explo',
            frames: scene.anims.generateFrameNumbers(imag, { start: 0, end: 9}),
            frameRate: 15,
            repeat: 0,
        });
        
        //MUY IMPORTANTE, ESCRIBIR COMPLETE BIEN Q SI TIENES DISLEXIA Y LO ESCRIBES MAL NO FUNCIONA
        this.on('animationcomplete',function(){
            this.destroy();
        });

        this.play('explo'); //le da a la animacion
    }

}