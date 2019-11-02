export default class Canon extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene,imag, parent) { //imag es el sprite que se va a cargar
        super(scene,17,17,imag);
        this.scene.add.existing(this); //le dice a la scene Game que existe
        
        this.pointer = this.scene.input.activePointer; //cursor del raton
        this.parent = parent;
    }


    preUpdate(){
        let angle = 0;
        angle = (Phaser.Math.Angle.Between(this.pointer.worldX,this.pointer.worldY,this.parent.x,this.parent.y))+1.57;  //es i.57 por q es pi medios (90 grados)
        this.rotation = angle;
        //console.log(angle);
    }


}