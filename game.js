import Wizard from "./wizard.js";
import Enemy from "./enemy.js" ;
import YelowEnemy from "./yellow_enemy.js" ;
import PinkEnemy from "./pink_enemy.js" ;

import UI from "./ui.js";
// Define a Keyboard class to handle keyboard input
class Keyboard {
    constructor(){
        // Create an empty object to store the pressed keys
        this.presed = {};
    }
    // Watch for keyboard events on a given element
    watch(ev){
        // Handle keydown events
        ev.addEventListener('keydown' ,(e) => {
            // Set the pressed state of the key to true
            this.presed[e.key] = true;
        });
        // Handle keyup events
        ev.addEventListener('keyup' ,(e) =>{
            // Set the pressed state of the key to false
            this.presed[e.key] = false;
        });
    }
};

class Game{

    constructor()
    {

    const Application = PIXI.Application
    this.app = new Application({
       width: 800,
       height: 720,
       transparent: false,
       antiallas: true,
       backgroundColor: 0xB3C8AA
   })
   this.app.stage = new PIXI.display.Stage()
   this.loader = PIXI.Loader.shared
   this.loader.add('wizard','./assets/wizard.png')
               .add('rock_enemy','./assets/rock_enemy.png')
               .add('blue_projectile','./assets/blue_projectile.png')
               .add('yellow_projectile','./assets/yellow_projectile.png')
               .add('red_projectile','./assets/red_projectile.png')
               .add('pink_projectile','./assets/pink_projectile.png')
               .add('purple_projectile','./assets/wizard_projectile.png')
               .add('blue_spot_empty','./assets/blue_bullet_spot.png')
               .add('blue_spot_full','./assets/blue_bullet_spot_full.png')
               .add('yellow_spot_empty','./assets/yellow_bullet_spot.png')
               .add('yellow_spot_full','./assets/yellow_bullet_spot_full.png')
               .add('pink_spot_empty','./assets/pink_bullet_spot_empty.png')
               .add('pink_spot_full','./assets/pink_bullet_spot_full.png')
               .add('red_explosion','./assets/red_explosion.png')
               .add('blue_explosion','./assets/blue_explosion.png')
               .add('heal','./assets/heal_particle.png')
               .add('ice_storm','./assets/ice_storm.webp')
               .add('buff_arm','./assets/buff_arm.webp')
               .add('speed_icon','./assets/man_running.webp')
               .add('heal_icon','./assets/heal_icon.webp')
               .add('life_increase','./assets/life_increase.webp')
               .add('ice_cub','./assets/ice.png')
               .add('ice_particle','./assets/ice_particle.png')



   document.body.appendChild(this.app.view)
   
   this.loader.onComplete.add(() => 
   {
    this.setup();
    this.app.ticker.add(delta => this.loop(delta))
}, this)

this.loader.load()
this.key = new Keyboard();
this.app.view.setAttribute('tabindex',0)
this.key.watch(this.app.view)
this.pause_game = false;

this.enemy_list = []
this.enemy_projectiles = [] 

}

loop(delta)
{

    if (this.pause_game == false)
        {
        this.wizard.wizardProjectiles.forEach(projectile => {
            projectile.update(); // Continue updating projectiles
            projectile.visible = true; // Ensure they are visible
        });
        this.wizard.key_handle();
        this.wizard.spells.update(delta);
        
        }
    else {
        // Game is paused, wizard make projectiles invisible
        this.wizard.wizardProjectiles.forEach(projectile => {
            projectile.visible = false; // Hide projectiles
        });
    
    }
    this.updateEnemy(); 
    this.ui.update();
}

setup()
{
      this.createEnemys();
      this.wizard = new Wizard(this);
      this.ui = new UI(this);

}

createEnemys()
{
    for(var i=0;i<8;i++)
    {
        let x_pos = Math.floor(Math.random() * 1000 + 20);
        let y_pos = Math.floor(Math.random() * 1000);
        var enemy = new Enemy(this,x_pos,y_pos)
        x_pos = Math.floor(Math.random() * 1000 + 20);
        y_pos = Math.floor(Math.random() * 1000);
        var enemy_type_2 = new YelowEnemy(this,x_pos,y_pos)
        x_pos = Math.floor(Math.random() * 1000 + 20);
        y_pos = Math.floor(Math.random() * 1000);
        var enemy_type_3 = new PinkEnemy(this,x_pos,y_pos)
        this.enemy_list.push(enemy)
        this.enemy_list.push(enemy_type_2)
        this.enemy_list.push(enemy_type_3)

    }
}

// Updates the state of enemy objects and their projectiles
updateEnemy() {

  if (this.pause_game == false)
    // Loop through each enemy in the enemy_list array and call the update method on each element
    this.enemy_list.forEach(element => {
        element.update();     
    });

  let filteredProjectiles = this.enemy_projectiles.filter(obj => obj.destroied == false);
  this.enemy_projectiles = filteredProjectiles;

  // Loop through each enemy projectile in the enemy_projectiles array and call the update method on each projectile
  this.enemy_projectiles.forEach((projectile) => {

    projectile.update(); // Update the internal state and position of the projectile
    
    // Calculate the bounds of the wizard sprite in global coordinates
    const wizardGlobalBounds = {
    x: this.wizard.x,
    y: this.wizard.y,
    width: this.wizard.sprite.height-5,
    height: this.wizard.sprite.width-5
    };

    // If the current projectile is colliding with the player's wizard and has a texture
    if (projectile.checkCollision(wizardGlobalBounds) && projectile.texture != null) 
    {
      this.wizard.hit_by_projectile(projectile); // Call the hit_by_projectile method on the player's wizard object, passing in the current projectile as an argument
    }
  });
 
}

}


function createRectangleGraphics(bounds, lineColor = 0xFF0000, lineWidth = 2, fillColor = 0x000000, fillAlpha = 0.1) {
    const graphics = new PIXI.Graphics();
    
    graphics.lineStyle(lineWidth, lineColor, 1); // Set line style
    graphics.beginFill(fillColor, fillAlpha); // Set fill color and alpha
    graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height); // Draw the rectangle
    graphics.endFill(); // End fill
    
    return graphics;
}


var colors_invaders = new Game();
