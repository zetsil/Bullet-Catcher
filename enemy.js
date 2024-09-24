import Projectile from "./projectile.js";
import UpdateTypes from "./updateTypes.js";

export default class Enemy extends PIXI.Container {
    constructor(game,pos_x,pos_y) 
    {
      super();
      this.game = game;
      this.sprite = new PIXI.Sprite(PIXI.Texture.from('rock_enemy'));
      this.sprite.anchor.set(0.5);
      // position
      this.x = pos_x ;
      this.y = pos_y ;
      // at creation add it to stage
      this.addChild(this.sprite);
      game.app.stage.addChild(this);
      // speed of the enemy 
      this.speed = 0.2;
      this.xp = 20;

      // projectile variables
      this.projectileTimer = 500;
      this.projectileCooldown = 500;
      this.projectileSpeed = 3;
      this.projectileTexture = PIXI.Texture.from('blue_projectile');
      this.projectileCooldown = 60; // 60 frames between each shot
      this.projectileTimer = this.projectileCooldown; // start with a full cooldown
      this.projectyle_type = "blue"
      this.is_enemy_dead = false;
      this.enemy_hit_sound = new Audio('assets/77_flesh_02.wav');


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
        projectile.type = this.projectyle_type
        projectile.x = this.x + velocity.x * 50; // spawn the projectile in front of the Enemy
        projectile.y = this.y + velocity.y * 50;
        this.game.app.stage.addChild(projectile); // add projectile sprite to stage 
        this.game.enemy_projectiles.push(projectile); // add the projectile to a list for collision detection
      }   

    hit()
    {
      this.y -= 10;
      this.flashRed();
      this.currentHealth = this.currentHealth - this.game.wizard.strength;
      const healthPercentage = this.getHealthPercentage();
      this.enemy_hit_sound.play();
      this.healthBar.width = healthPercentage / 100 * 100;
     
      if(this.currentHealth <= 0 ){
        this.destroy();
        this.game.wizard.currentXP += this.xp 
        this.game.wizard.notifyObservers(UpdateTypes.XP);

      }

    }  

    flashRed() {
      const filter = new PIXI.filters.ColorMatrixFilter();
      filter.brightness(5);
      filter.hue(0.5, true);
      this.sprite.filters = [filter];
      setTimeout(() => {
        this.sprite.filters = [];
      }, 200);
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
        this.game.wizard.current_xp += this.xp
      }  
}
