import Projectile from "./projectile.js";
import UI from "./ui.js";
import UpdateTypes from "./updateTypes.js";
import Magic from "./magic.js";

class WizardProjectile extends Projectile {

  constructor(texture,speed,angle,shooter){
    super(texture,speed,angle,shooter);
    this.speed = 20;
  }
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
    this.lvl = 0;
    this.nextLevelXP = 2;
    this.currentXP = 0;
    this.x = 1;
    this.y = 1;
    this.sprite.scale.x = 0.8;
    this.sprite.scale.y = 0.8;
    this.currentHealth = 10;
    this.totalHealth = 10;
    this.strength = 1;
    this.spells = new Magic(this)
    this.addChild(this.sprite);
    this.shoot_sound = new Audio('assets/04_Fire_explosion_04_medium.wav');
    this.heal_sound = new Audio('assets/02_Heal_02.wav');
    game.app.stage.addChild(this);
    this.speed = 6;

    // Register the UI as an observer of the Wizard
    this.observers = [];
    this.addObserver(this.spells)
    console.log(game.ui)

  
    this.projectileTexture = PIXI.Texture.from('purple_projectile');
    this.projectileSpeed = 9;
    this.wizardProjectiles = [];
    // projectile numbers
    this.current_projectile = ''
    this.bullet_holder = new BulletHolder()


    this.game.app.view.addEventListener('click', (event) => {
      // Get the mouse coordinates relative to the top-left corner of the app.view
      const x = event.clientX - this.game.app.view.offsetLeft;
      const y = event.clientY - this.game.app.view.offsetTop;
      console.log(`Mouse clicked at (${x}, ${y})`);

      const angle = this.calculateAngle(x, y);
      this.shootProjectile(angle)
    });

    // Handle right-click (contextmenu event)
    this.game.app.view.addEventListener('contextmenu', (event) => {
      // Prevent the default right-click context menu from showing up
      event.preventDefault();

      // Get the mouse coordinates relative to the top-left corner of the app.view
      const x = event.clientX - this.game.app.view.offsetLeft;
      const y = event.clientY - this.game.app.view.offsetTop;
      console.log(`Right mouse clicked at (${x}, ${y})`);

      // Call a different function for the right-click, for example:
      const angle = this.calculateAngle(x, y);
      this.activateMagic(angle); // Example alternative action
    });
  }

  // Method to add an observer
  addObserver(observer) 
  {
    if (observer instanceof Magic) {
      this.observers.push(observer);
    }

    if (observer instanceof UI || observer instanceof Projectile && !this.observers.includes(observer)) {
        this.observers.push(observer);
    }
  }

  // Method to remove an observer
  removeObserver(observer) 
  {
      this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Method to notify all observers
  notifyObservers(type, data = null) {
    // Assuming `this.observers` is an array of registered observers
    this.observers.forEach(observer => {
        // Call the observer's update method with both `type` and `data` (e.g., angle)
        observer.updateState(this, type, data);
    });
}

  key_handle() {
    // Check if the right arrow key is pressed
    if (this.game.key.presed.ArrowRight) {
      this.x += this.speed ;
      // Handle right arrow key press
    }
    // Check if the left arrow key is pressed
    else if (this.game.key.presed.ArrowLeft) {
      this.x -= this.speed ;
      // Handle left arrow key press
    }
    // Check if the up arrow key is pressed
    else if (this.game.key.presed.ArrowUp) {
      this.y -= this.speed ;
      // Handle up arrow key press
    }
    // Check if the down arrow key is pressed
    else if (this.game.key.presed.ArrowDown) {
      this.y += this.speed ;
      // Handle down arrow key press
    }

    // Check if the right arrow key is pressed
    if (this.game.key.presed.d) {
      this.x += this.speed ;
      // Handle right arrow key press
    }
    // Check if the left arrow key is pressed
    else if (this.game.key.presed.a) {
      this.x -= this.speed ;
      // Handle left arrow key press
    }
    // Check if the up arrow key is pressed
    else if (this.game.key.presed.w) {
      this.y -= this.speed ;
      // Handle up arrow key press
    }
    // Check if the down arrow key is pressed
    else if (this.game.key.presed.s) {
      this.y += this.speed ;
      // Handle down arrow key press
    }


    this.game.app.stage.x = -this.x + 35 * 10;
    this.game.app.stage.y = -this.y + 62 * 5;
  }

  hit_by_projectile(projectile) {
    console.log(this.currentHealth);
    projectile.emitExplosion();

    // Get the type of the projectile
    const projectileType = projectile.type;

    // Check if the BulletHolder can accommodate the projectile type
    if (this.bullet_holder.bullets[projectileType]) {
        // Attempt to fill the BulletHolder with the projectile
        if (this.bullet_holder.bullets[projectileType].full) {
            this.notifyObservers(UpdateTypes.PROJECTILE_COUNT_CHANGED)
            this.currentHealth--;
            this.hit(1);
        } else {
            // Fill the bullet holder with the correct bullet type
            this.bullet_holder.collectBullet(projectileType);
            this.notifyObservers(UpdateTypes.PROJECTILE_COUNT_CHANGED)
            this.notifyObservers(UpdateTypes.FILL_SPOT)
            // Update current projectile type
            this.current_projectile = projectileType;
        }
    } else {
        // Handle cases where the projectile type is not recognized
        console.log(`Projectile type ${projectileType} is not recognized.`);
        this.currentHealth--;
        this.hit(1);
    }
}


hit(amount) {
  this.currentHealth -= amount;
  this.currentHealth = Math.max(0, this.currentHealth); // Ensure health doesn't go below 0
  this.notifyObservers(UpdateTypes.HEALTH);
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

    // Get the type of the bullet at the first position
    const firstBulletType = this.bullet_holder.getFirstPosition().type;

     // Check if there is a bullet at the first position and it is full
    if (firstBulletType && this.bullet_holder.bullets[firstBulletType].full) 
    {
      // Empty the bullet at the first position
      this.bullet_holder.emptyBullet(firstBulletType);
      this.notifyObservers(UpdateTypes.FILL_SPOT);
      this.notifyObservers(UpdateTypes.PROJECTILE_COUNT_CHANGED)

      // Play shooting sound
      this.shoot_sound.play();
    }
    else
      // don't shoot , you don t have eny bullets
      return;

    const projectile = new WizardProjectile(this.projectileTexture, this.projectileSpeed, angle, this);
    projectile.x = this.x; // spawn the projectile in front of the Player/Wizard
    projectile.y = this.y;
    this.game.app.stage.addChild(projectile); // add projectile sprite to stage 
    this.wizardProjectiles.push(projectile); // add the projectile to a list for collision detection
  }

  activateMagic(angle){
    let first_place = this.bullet_holder.order[0]
    let second_place = this.bullet_holder.order[1]
    let third_place = this.bullet_holder.order[2]

    console.log(first_place)

    // Check if the first bullet is pink and full, and the next two are empty and heal activated
    if (first_place.type === 'pink' && first_place.isFull() &&!second_place.isFull() && !third_place.isFull() && this.spells.heal) 
      {
          this.currentHealth += 2;
          this.notifyObservers(UpdateTypes.HEAL);
      }
        // Check if the first bullet is blue and the next two are empty
    if (first_place.type === 'blue' && first_place.isFull() && !second_place.isFull() && !third_place.isFull()) 
    {
      this.notifyObservers(UpdateTypes.FREEZ,angle);
    }  

  }

}

class Bullet {
  constructor(type) {
    this.type = type;
    this.full = false; // Initially, the bullet is not full
  }

  // Method to display bullet's details
  displayDetails() {
    console.log(`Type: ${this.type}, Full: ${this.full}`);
  }

  isFull(){
    return this.full;
  }

  // Method to make the bullet full
  fill(){
    this.full = true;
  }

  // Method to shoot the bullet (making it empty)
  shoot() {
    if (this.full) {
      this.full = false;
      return true;
    }
    return false; // Can't shoot an empty bullet
  }
}

class BulletHolder {
  constructor() {
    // Initialize Bullet objects
    this.bullets = {
      blue: new Bullet('blue'),
      yellow: new Bullet('yellow'),
      pink: new Bullet('pink'),
    };
    
    // Array to keep track of Bullet objects in order
    this.order = [
      this.bullets.blue,
      this.bullets.yellow,
      this.bullets.pink,
    ];
  }

  // Method to collect a bullet of a specific type
  collectBullet(type) {
    const bullet = this.bullets[type];
    if (bullet) {
      bullet.fill();
      // Move the collected bullet to the front of the order
      this.moveToFront(bullet);
    } else {
      console.log(`Bullet type ${type} does not exist.`);
    }
  }

  // Method to shoot a bullet of a specific type
  shootBullet(type) {
    const bullet = this.bullets[type];
    if (bullet) {
      if (bullet.shoot()) {
        console.log(`Shot ${type} bullet.`);
        // Move the shot bullet to the back of the order
        this.moveToBack(bullet);
      } else {
        console.log(`${type} bullet is empty. Cannot shoot.`);
      }
    } else {
      console.log(`Bullet type ${type} does not exist.`);
    }
  }

  // Method to handle emptying a bullet
  emptyBullet(type) {
    const bullet = this.bullets[type];
    if (bullet) {
      if (bullet.shoot()) { // Shoot the bullet and check if it was successful
        this.moveToBack(bullet); // Move the bullet to the back if it's now empty
      } else {
        console.log(`${type} bullet is already empty.`);
      }
    } else {
      console.log(`Bullet type ${type} does not exist.`);
    }
  }

  // Move a Bullet to the front of the order, considering full bullets
  moveToFront(bullet) {
    const index = this.order.indexOf(bullet);
    if (index !== -1) {
      // Remove the Bullet from its current position
      this.order.splice(index, 1);

      // Find the correct position to insert the Bullet
      let insertIndex = 0;
      while (insertIndex < this.order.length && this.order[insertIndex].isFull()) {
        insertIndex++;
      }

      // Insert the Bullet at the correct position
      this.order.splice(insertIndex, 0, bullet);
    }
  }

  // Move a Bullet to the back of the order
  moveToBack(bullet) {
    const index = this.order.indexOf(bullet);
    if (index !== -1) {
      this.order.splice(index, 1);
      this.order.push(bullet);
    }
  }

  // Method to display the state of all bullets in order
  displayBulletStates() {
    this.order.forEach(bullet => bullet.displayDetails());
  }

  // Method to get the bullet at the first position
  getFirstPosition() {
    return this.order.length > 0 ? this.order[0] : null;
  }
}


