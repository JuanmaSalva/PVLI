export default class Canon extends Phaser.GameObjects.Sprite { //es un gameobject
    constructor(scene, imag, parent) { //imag es el sprite que se va a cargar
        super(scene, 0, -1, imag); //llama al constructor de la clase por encima
        this.scene.add.existing(this); //le dice a la scene Game que existe        
        this.pointer = this.scene.input.activePointer; //cursor del raton
        this.parent = parent;
        this.arma;
        parent.canon = this;
        this.scene = scene;
        this.rango;

        scene.input.on('pointerdown', pointer => { //creacion del evento de cuando se suelta el clic
            if(this.arma != 'mortero')parent.spawnBala();
        })

        scene.input.on('pointerup', pointer => { //creacion del evento de cuando se suelta el clic            
            if (this.arma == 'mortero' && this.circulo) this.circulo.destroy(); 
            if(this.arma == 'mortero' && pointer.leftButtonReleased())parent.spawnBala();
        })
    }

    preUpdate() {
        let angle = 0;
        angle = (Phaser.Math.Angle.Between(this.pointer.worldX + 10, this.pointer.worldY + 10, this.parent.x, this.parent.y) + Math.PI / 2);  //es 10 del tamaño del cursor
        this.rotation = angle;
        if (this.pointer.isDown && this.arma == 'mortero') {
            if(this.circulo) this.circulo.destroy();
            this.circulo = this.scene.add.circle(this.parent.x, this.parent.y, this.rango);
            this.circulo.setStrokeStyle(2, 0xff0000);
        }
    }


}

Canon.prototype.setRange = function (rango) {
    this.rango = rango;
}


Canon.prototype.setArma = function (arma) {
    this.arma = arma;
}
