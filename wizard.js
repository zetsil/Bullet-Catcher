import Projectile from "./projectile.js";

class WizardProjectile extends Projectile
{

    //overide function
    update() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;
      const dx = this.x - this.theShooter.sprite.x;
      const dy = this.y - this.theShooter.sprite.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > this.maxDistance)
      {
        this.destroy();     
      }
      this.theShooter.game.enemy_list.forEach(enemy => {
         if(this.checkCollision(enemy.sprite))
         {
            enemy.destroy();
            this.destroy();
         }
      });
      }
}

export default class Wizard extends PIXI.Container {
    constructor(game) {
      super();
      this.game = game;
      this.sprite = new PIXI.Sprite(game.loader.resources.wizard.texture);
      this.sprite.anchor.set(0.5);
      this.sprite.x = 20;
      this.sprite.y = 20 ;
      this.sprite.scale.x = 0.8;
      this.sprite.scale.y = 0.8;
      this.health = 10;
      this.addChild(this.sprite);
      game.app.stage.addChild(this);


      this.projectileTexture = game.loader.resources.purple_projectile.texture;
      this.projectileSpeed = 9;
      this.wizardProjectiles = [];
      this.blue_projectile = 0;
      this.max_blue_projectile = 1;



      this.game.app.view.addEventListener('click', (event) => {
        // Get the mouse coordinates relative to the top-left corner of the app.view
        const x = event.clientX - this.game.app.view.offsetLeft;
        const y = event.clientY - this.game.app.view.offsetTop;
        console.log(`Mouse clicked at (${x}, ${y})`);

        const angle = this.calculateAngle(x,y);
        this.shootProjectile(angle)
      });
  

    }


    key_handle() {
        // Check if the right arrow key is pressed
        if (this.game.key.presed.ArrowRight) {
          this.sprite.x += 4;
          // Handle right arrow key press
        }
        // Check if the left arrow key is pressed
        else if (this.game.key.presed.ArrowLeft) {
          this.sprite.x -= 4;
          // Handle left arrow key press
        }
        // Check if the up arrow key is pressed
        else if (this.game.key.presed.ArrowUp) {
          this.sprite.y -= 4;
          // Handle up arrow key press
        }
        // Check if the down arrow key is pressed
        else if (this.game.key.presed.ArrowDown) {
          this.sprite.y += 4;
          // Handle down arrow key press
        }
         this.game.app.stage.x = -this.sprite.x + 35 * 10 ;
         this.game.app.stage.y = -this.sprite.y + 62 * 5 ;
        //  console.log(this.sprite.x)
      }

    hit_by_projectile(projectile)
    {
      projectile.destroy();
      this.health --;
      if(this.blue_projectile < this.max_blue_projectile )
            this.blue_projectile++;
    }  

    calculateAngle(x,y)
    {
       // Get the x and y coordinates of the click
      const clickX = x;
      const clickY = y;
      // Calculate the angle between the click point and the sprite
      const dx = clickX - this.game.app.view.width/2 + 50;
      const dy = clickY - this.game.app.view.height/2 + 50;
      const angle = Math.atan2(dy, dx);
      return angle
    }

    shootProjectile(angle) {
      if(this.blue_projectile >= this.max_blue_projectile )
        this.blue_projectile--;
      else 
        return;  
      const velocity = new PIXI.Point(Math.cos(angle), Math.sin(angle));
      const projectile = new WizardProjectile(this.projectileTexture, this.projectileSpeed, angle,this);
      projectile.x = this.sprite.x ; // spawn the projectile in front of the Enemy
      projectile.y = this.sprite.y ;
      this.game.app.stage.addChild(projectile); // add projectile sprite to stage 
      this.wizardProjectiles.push(projectile); // add the projectile to a list for collision detection
    }   
  
  }

