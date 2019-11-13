export default class Canon extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, imag, parent) { //imag es el sprite que se va a cargar
        super(scene, 0, -1, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe        
        this.pointer = this.scene.input.activePointer; //cursor del raton
        this.parent = parent;
        
        scene.input.on('pointerup', pointer => { //creacion del evento de cuando se suelta el clic
            if(pointer.leftButtonReleased()){
                parent.spawnBala();
            }
        })
    }

    preUpdate() {
        let angle = 0;
        angle = (Phaser.Math.Angle.Between(this.pointer.worldX + 10, this.pointer.worldY + 10, this.parent.x, this.parent.y) + Math.PI / 2);  //es 10 del tamaño del cursor
        this.rotation = angle;
    }
}