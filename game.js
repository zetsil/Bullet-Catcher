import Wizard from "./wizard.js";
import Enemy from "./enemy.js";
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
               .add('projectile','./assets/blue_projectile.png')
               .add('red_projectile','./assets/red_projectile.png')
               .add('purple_projectile','./assets/wizard_projectile.png')
               .add('blue_spot','./assets/blue_bullet_spot.png')
               .add('blue_spot_full','./assets/blue_bullet_spot_full.png')


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


this.enemy_list = []
this.enemy_projectiles = [] // 

}

loop(delta)
{
    this.updateEnemy();
    this.wizard.key_handle();
    this.UI.update();
    this.wizard.wizardProjectiles.forEach(projectile => {
        projectile.update();
    });


}

setup()
{
      this.wizard = new Wizard(this)
      this.createEnemys()
      this.UI = new UI(this);

}

createEnemys()
{
    for(var i=0;i<30;i++)
    {
        let x_pos = Math.floor(Math.random() * 1000 + 20);
        let y_pos = Math.floor(Math.random() * 1000);
        var enemy = new Enemy(this,x_pos,y_pos)
        this.enemy_list.push(enemy)
    }
}

// Updates the state of enemy objects and their projectiles
updateEnemy() {

  // Loop through each enemy in the enemy_list array and call the update method on each element
  this.enemy_list.forEach(element => {
    element.update();     
  });
  let filteredProjectiles = this.enemy_projectiles.filter(obj => obj.destroied == false);
  this.enemy_projectiles = filteredProjectiles;
  // Loop through each enemy projectile in the enemy_projectiles array and call the update method on each projectile
  this.enemy_projectiles.forEach((projectile) => {

    projectile.update(); // Update the internal state and position of the projectile

    // If the player's wizard has max blue projectiles and the current projectile being updated is a blue projectile and the texture is not already the red projectile texture
    if (this.wizard.blue_projectile == this.wizard.max_blue_projectile && projectile.type == "blue" && projectile.texture != this.loader.resources.red_projectile.texture) {
      projectile.texture = this.loader.resources.red_projectile.texture; // Change the texture of the projectile to the red projectile texture
    }
    // If the player's wizard has no blue projectiles left and the current projectile being updated is a blue projectile and the texture is not already the default projectile texture
    else if (this.wizard.blue_projectile == 0 && projectile.type == "blue" && projectile.texture != this.loader.resources.projectile.texture) {
      projectile.texture = this.loader.resources.projectile.texture; // Change the texture of the projectile to the default projectile texture
    }

    // If the current projectile is colliding with the player's wizard and has a texture
    if (projectile.checkCollision(this.wizard) && projectile.texture != null) {
      this.wizard.hit_by_projectile(projectile); // Call the hit_by_projectile method on the player's wizard object, passing in the current projectile as an argument
    }
  });
 
}

}


var colors_invaders = new Game();
