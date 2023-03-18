import Projectile from "./projectile.js";

class WizardProjectile extends Projectile {

  //overide function
  update() {
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
    const dx = this.x - this.theShooter.sprite.x;
    const dy = this.y - this.theShooter.sprite.y;
    this.type = "purple";
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > this.maxDistance) {
      this.destroy();
    }
    this.theShooter.game.enemy_list.forEach(enemy => {
      if (this.checkCollision(enemy) && enemy.speed != null) {
        enemy.hit();
        this.emitExplosion();
      }
    });

    if (this.emitter !== null) {
      this.emitter.update(0.009);
      this.explode_timeout--;
    }

    if (this.explode_timeout == 0) {
      this.emitter.emit = false;
      this.destroy();

    }

  }
}

export default class Wizard extends PIXI.Container {
  constructor(game) {
    super();
    this.game = game;
    this.sprite = new PIXI.Sprite(PIXI.Texture.from('wizard'));
    this.sprite.anchor.set(0.5);
    // this.sprite.x = 20;
    // this.sprite.y = 20 ;
    this.x = 1;
    this.y = 1;
    this.sprite.scale.x = 0.8;
    this.sprite.scale.y = 0.8;
    this.currentHealth = 10;
    this.totalHealth = 10;
    this.addChild(this.sprite);
    game.app.stage.addChild(this);


    this.projectileTexture = PIXI.Texture.from('purple_projectile');
    this.projectileSpeed = 9;
    this.wizardProjectiles = [];
    this.blue_projectile = 0;

    this.map_current_projectiles = new Map();
    this.map_current_projectiles.set('blue', 0);
    this.map_current_projectiles.set('green', 0);
    this.map_current_projectiles.set('yellow', 0);

    this.max_projectile_map = new Map();
    this.max_projectile_map.set('blue', 1);
    this.max_projectile_map.set('green', 0);
    this.max_projectile_map.set('yellow', 0);


    this.max_blue_projectile = 1;


    // this.bullet_spot = new PIXI.Sprite(game.loader.resources.blue_spot.texture);
    // this.addChild(this.bullet_spot);
    // this.bullet_spot.x = -20;
    // this.bullet_spot.y = -20;




    this.game.app.view.addEventListener('click', (event) => {
      // Get the mouse coordinates relative to the top-left corner of the app.view
      const x = event.clientX - this.game.app.view.offsetLeft;
      const y = event.clientY - this.game.app.view.offsetTop;
      console.log(`Mouse clicked at (${x}, ${y})`);

      const angle = this.calculateAngle(x, y);
      this.shootProjectile(angle)
    });


  }


  key_handle() {
    // Check if the right arrow key is pressed
    if (this.game.key.presed.ArrowRight) {
      this.x += 4;
      // Handle right arrow key press
    }
    // Check if the left arrow key is pressed
    else if (this.game.key.presed.ArrowLeft) {
      this.x -= 4;
      // Handle left arrow key press
    }
    // Check if the up arrow key is pressed
    else if (this.game.key.presed.ArrowUp) {
      this.y -= 4;
      // Handle up arrow key press
    }
    // Check if the down arrow key is pressed
    else if (this.game.key.presed.ArrowDown) {
      this.y += 4;
      // Handle down arrow key press
    }

    // Check if the right arrow key is pressed
    if (this.game.key.presed.d) {
      this.x += 4;
      // Handle right arrow key press
    }
    // Check if the left arrow key is pressed
    else if (this.game.key.presed.a) {
      this.x -= 4;
      // Handle left arrow key press
    }
    // Check if the up arrow key is pressed
    else if (this.game.key.presed.w) {
      this.y -= 4;
      // Handle up arrow key press
    }
    // Check if the down arrow key is pressed
    else if (this.game.key.presed.s) {
      this.y += 4;
      // Handle down arrow key press
    }


    this.game.app.stage.x = -this.x + 35 * 10;
    this.game.app.stage.y = -this.y + 62 * 5;
    //  console.log(this.sprite.x)
  }

  hit_by_projectile(projectile) {
    console.log(this.currentHealth);
    projectile.emitExplosion();

    if (this.blue_projectile < this.max_blue_projectile) {
      this.blue_projectile++;
      this.map_current_projectiles.set('blue', this.blue_projectile);

    }
    else {
      this.currentHealth--;
      this.hit();
    }


  }

  hit() {
    const healthPercentage = this.getHealthPercentage();
    this.game.UI.WizardhealthBar.width = healthPercentage / 100 * 80;

  }


  getHealthPercentage() {
    return this.currentHealth / this.totalHealth * 100;
  }


  getHealthPercentage() {
    return this.currentHealth / this.totalHealth * 100;
  }

  calculateAngle(x, y) {
    // Get the x and y coordinates of the click
    const clickX = x;
    const clickY = y;
    // Calculate the angle between the click point and the sprite
    const dx = clickX - this.game.app.view.width / 2 + 50;
    const dy = clickY - this.game.app.view.height / 2 + 50;
    const angle = Math.atan2(dy, dx);
    return angle
  }

  shootProjectile(angle) {
    if (this.blue_projectile >= this.max_blue_projectile) {
      this.blue_projectile--;
      this.map_current_projectiles.set('blue', this.blue_projectile);
    }
    else
      return;
    const projectile = new WizardProjectile(this.projectileTexture, this.projectileSpeed, angle, this);
    projectile.x = this.x; // spawn the projectile in front of the Enemy
    projectile.y = this.y;
    this.game.app.stage.addChild(projectile); // add projectile sprite to stage 
    this.wizardProjectiles.push(projectile); // add the projectile to a list for collision detection
  }

}

