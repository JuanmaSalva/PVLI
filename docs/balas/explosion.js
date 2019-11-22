export default class ExplosionAnim extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, x, y,imag) { //imag es el sprite que se va a cargar
        super(scene, x, y, imag); //llama al constructor de la clase por encima
    }

    create(){
        this.anims.create({
            key: 'explo',
            frames: this.anims.generateFrameNumbers('animacion', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        player.anims.play('explo', true);
    }

}