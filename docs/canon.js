export default class Canon extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene,imag) { //imag es el sprite que se va a cargar
        super(scene,0,10,imag);
        this.scene.add.existing(this); //le dice a la scene Game que existe
        
        this.pointer = this.scene.input.activePointer; //cursor del raton
    }


    preUpdate(){
        let angle = 0;
        angle = (Phaser.Math.Angle.Between(this.pointer.worldX,this.pointer.worldY,this.x,this.y))+1.57;  //es i.57 por q es pi medios (90 grados)
        this.rotation = angle;
        //console.log(angle);
    }


}