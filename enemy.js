import Projectile from "./projectile.js";
export default class Enemy extends PIXI.Container {
    constructor(game,pos_x,pos_y) 
    {
      super();
      this.game = game;
      this.sprite = new PIXI.Sprite(game.loader.resources.rock_enemy.texture);
      this.sprite.anchor.set(0.5);
      this.sprite.x = pos_x ;
      this.sprite.y = pos_y ;
      this.addChild(this.sprite);
      game.app.stage.addChild(this);
      this.speed = 0.2;

      this.projectileTimer = 500;
      this.projectileCooldown = 500;
      this.projectileSpeed = 2;
      this.projectileTexture = game.loader.resources.projectile.texture;
      this.projectileCooldown = 60; // 60 frames between each shot
      this.projectileTimer = this.projectileCooldown; // start with a full cooldown
      this.is_enemy_dead = false;
    }

    update()
    {
      if(this.sprite.texture == null)
        return
      const dx =  this.sprite.x - this.game.wizard.sprite.x;
      const dy = this.sprite.y - this.game.wizard.sprite.y;
      const angle = Math.atan2(dy, dx);
      this.sprite.x -= Math.cos(angle) * this.speed;
      this.sprite.y -= Math.sin(angle) * this.speed;
      this.projectileTimer--;
      if (this.projectileTimer <= 0 && !this.is_enemy_dead) {
        this.projectileTimer = this.projectileCooldown;
        this.shootProjectile();
      }
     
    }
  
    shootProjectile() {

        const angle = Math.random() * 2 * Math.PI;
        const velocity = new PIXI.Point(Math.cos(angle), Math.sin(angle));
        const projectile = new Projectile(this.projectileTexture, this.projectileSpeed, angle,this);
        projectile.x = this.sprite.x + velocity.x * 50; // spawn the projectile in front of the Enemy
        projectile.y = this.sprite.y + velocity.y * 50;
        this.game.app.stage.addChild(projectile); // add projectile sprite to stage 
        this.game.enemy_projectiles.push(projectile); // add the projectile to a list for collision detection
      }   

    destroy() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.speed = null;
        this.sprite.texture = null;
        this.sprite.x = null;
        this.sprite.y = null;
        this.is_enemy_dead = true;
      }  
}
