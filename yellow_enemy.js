import Enemy from "./enemy.js";

export default class YelowEnemy extends Enemy{
    constructor(game,pos_x,pos_y)
    {
        super(game,pos_x,pos_y);
        this.projectileTexture = PIXI.Texture.from('yellow_projectile');
        this.projectyle_type = "yellow"
    }
}