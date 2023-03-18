import Projectile from "./projectile.js";
export default class Enemy extends PIXI.Container {
    constructor(game,pos_x,pos_y) 
    {
      super();
      this.game = game;
      this.sprite = new PIXI.Sprite(PIXI.Texture.from('rock_enemy'));
      this.sprite.anchor.set(0.5);
      this.x = pos_x ;
      this.y = pos_y ;
      this.addChild(this.sprite);
      game.app.stage.addChild(this);
      this.speed = 0.2;

      this.projectileTimer = 500;
      this.projectileCooldown = 500;
      this.projectileSpeed = 3;
      this.original_texture = PIXI.Texture.from('projectile');
      this.projectileTexture = PIXI.Texture.from('projectile');
      this.projectileCooldown = 60; // 60 frames between each shot
      this.projectileTimer = this.projectileCooldown; // start with a full cooldown
      this.is_enemy_dead = false;

      // Health Bar
      this.currentHealth= 2;
      this.totalHealth = 2;

      this.healthBarEmpty = new PIXI.Graphics();
      this.healthBarEmpty.beginFill(0xA0A0A0);
      this.healthBarEmpty.drawRect(-25, -40, 50, 5);
      this.healthBarEmpty.endFill();
      this.addChild(this.healthBarEmpty);

      this.healthBar = new PIXI.Graphics();
      this.healthBar.beginFill(0xff0000);
      this.healthBar.drawRect(-25, -40, 50, 5);
      this.healthBar.endFill();
      this.addChild(this.healthBar);


    }

    update()
    {
      if(this.sprite.texture == null)
        return
      const dx =  this.x - this.game.wizard.x;
      const dy = this.y - this.game.wizard.y;
      const angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * this.speed;
      this.y -= Math.sin(angle) * this.speed;
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
        projectile.x = this.x + velocity.x * 50; // spawn the projectile in front of the Enemy
        projectile.y = this.y + velocity.y * 50;
        this.game.app.stage.addChild(projectile); // add projectile sprite to stage 
        this.game.enemy_projectiles.push(projectile); // add the projectile to a list for collision detection
      }   

    hit()
    {
      this.currentHealth--;
      const healthPercentage = this.getHealthPercentage();
      this.healthBar.width = healthPercentage / 100 * 100;
     
      if(this.currentHealth == 0 ){
        this.destroy();

      }

    }  

    getHealthPercentage() {
      return this.currentHealth / this.totalHealth * 50;
    }

    destroy() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.speed = null;
        this.sprite.texture = null;
        this.x = null;
        this.y = null;
        this.is_enemy_dead = true;
      }  
}
