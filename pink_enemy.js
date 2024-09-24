import Enemy from "./enemy.js";

export default class PinkEnemy extends Enemy{
    constructor(game,pos_x,pos_y)
    {
        super(game,pos_x,pos_y);
        this.projectileTexture = PIXI.Texture.from('pink_projectile');
        this.projectyle_type = "pink"
    }
}