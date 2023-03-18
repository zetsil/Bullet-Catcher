export default class UI extends PIXI.Container {
    constructor(game) {
        super();
        this.game = game;
        this.bullet_spot = new PIXI.Sprite(game.loader.resources.blue_spot.texture);
        this.bullet_spot.anchor.set(0.5);
        this.bullet_spot.x = -20;
        this.bullet_spot.y = -20 ;
        this.bullet_spot.scale.x = 0.8;
        this.bullet_spot.scale.y = 0.8;
        this.x = this.game.wizard.x
        this.y = this.game.wizard.y;
        this.addChild(this.bullet_spot);
        this.game.app.stage.addChild(this);


        this.WizardhealthBarEmpty = new PIXI.Graphics();
        this.WizardhealthBarEmpty.beginFill(0xA0A0A0);
        this.WizardhealthBarEmpty.drawRect(-25, -40, 80, 5);
        this.WizardhealthBarEmpty.endFill();
        this.addChild(this.WizardhealthBarEmpty);


        this.WizardhealthBar = new PIXI.Graphics();
        this.WizardhealthBar.beginFill(0x225128);
        this.WizardhealthBar.drawRect(-25, -40, 80, 5);
        this.WizardhealthBar.endFill();
        this.addChild(this.WizardhealthBar)

    }




    update(){

        if(this.game.wizard.blue_projectile == 1 && this.game.wizard.blue_projectile.texture !=  this.game.loader.resources.blue_spot_full.texture)
           this.bullet_spot.texture =  this.game.loader.resources.blue_spot_full.texture
        else if(this.game.wizard.blue_projectile == 0 && this.game.wizard.blue_projectile.texture !=  this.game.loader.resources.blue_spot.texture)
           this.bullet_spot.texture =  this.game.loader.resources.blue_spot.texture

        this.x = this.game.wizard.x;
        this.y = this.game.wizard.y;
    }
  


}
