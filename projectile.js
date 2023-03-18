//   Constructor for the Projectile class
//   Parameters:
// - texture: the texture for the projectile sprite
// - speed: the speed at which the projectile moves
// - direction: the direction in radians that the projectile moves in
// - theShooter: the theShooter object from witch the projectil is shoot 
export default class Projectile extends PIXI.Sprite {
  constructor(texture, speed, direction, theShooter){
    super(texture);
    this.original_texture = texture;
    this.red_texture = PIXI.Texture.from('red_projectile');
    this.speed = speed;
    this.direction = direction;
    this.theShooter = theShooter;
    this.maxDistance = 3000; // maxDistance radiuse for the projectile center having the enemy 
    this.anchor.set(0.5); // Set the anchor point of the sprite to its center
    this.type = "blue";
    this.destroied = false;
    this.emitter = null;
    this.explode_timeout = 15;


  }
  // Update function for the Projectile class
  // Moves the projectile in the specified direction and checks if it has exceeded its maximum distance
  update() {
    if(this.emitter !== null)
    {
       this.emitter.update(0.009);
       this.explode_timeout--;
    }
    if (this.destroied)
      return;  
  //  this.emitter.update(1);

  // If the player's wizard has max blue/red/yellow projectiles and the current projectile being updated is a blue/red/yellow projectile and the texture is not already the red projectile texture
  if (this.theShooter.game.wizard.map_current_projectiles.get(this.type) == this.theShooter.game.wizard.max_projectile_map.get(this.type) &&  this.texture != this.red_texture)
      this.texture = this.red_texture; // Change the texture of the projectile to the red projectile texture
  // If the cuurent projectiles of the wizard are not full     
  else if(this.theShooter.game.wizard.map_current_projectiles.get(this.type) < this.theShooter.game.wizard.max_projectile_map.get(this.type) &&  this.texture != this.original_texture)    
      this.texture = this.original_texture; // Change the texture of the projectile to the original(blue/red/yellow) projectile texture

    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
    const dx = this.x - this.theShooter.sprite.x;
    const dy = this.y - this.theShooter.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > this.maxDistance) {
      this.destroy();
    }
     if(this.explode_timeout == 0)
     {
       this.emitter.emit = false;
       this.destroy();

     }
  }
  // Destroy function for the Projectile class
  // Removes the sprite from its parent container and cleans up its properties
  destroy() {
    if (this.parent) {
      this.parent.removeChild(this);
      if(this.emitter !== null)
      {
       this.particleContainer.removeChild(this);
       this.emitter.destroy();
      }
    }
    this.speed = null;
    this.direction = null;
    this.texture = null;
    this.x = null;
    this.y = null;
    this.destroied = true;
  }

  checkCollision(sprite) {
    return this.hitTestRectangle(this, sprite);
  }

  hitTestRectangle(r1, r2) {
    if(this.emitter !== null)
       return false;
    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
      } else {

        //There's no collision on the y axis
        hit = false;
      }
    } else {

      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  }

  createEmmiter() {
    // Creează un container pentru particule
    this.particleContainer = new PIXI.ParticleContainer();
    this.particleContainer.x = this.x;
    this.particleContainer.y = this.y;
    this.emitter_texture = PIXI.Texture.from('red_explosion');

    if(this.texture == PIXI.Texture.from('purple_projectile'))
       this.emitter_texture =  PIXI.Texture.from('blue_explosion');
    if(this.texture == PIXI.Texture.from('projectile'))
       this.emitter_texture =  PIXI.Texture.from('blue_explosion');   
       


    // Creează un emitter de particule
    this.emitter = new PIXI.particles.Emitter(
      // Container-ul în care se vor afișa particulele
      this.particleContainer,

      // Textura particulelor
      [this.emitter_texture],

      // Configurația emitter-ului
      {
        alpha: {
          start: 1,
          end: 0,
        },
        scale: {
          start: 1,
          end: 0.3,
        },
        color: {
          start: 'ffffff',
          end: 'ff0000',
        },
        speed: {
          start: 400,
          end: 50,
        },
        startRotation: {
          min: 0,
          max: 360,
        },
        rotationSpeed: {
          min: -100,
          max: 100,
        },
        lifetime: {
          min: 0.5,
          max: 0.5,
        },
        blendMode: 'normal',
        frequency: 0.02,
        minParticles: 10,
        maxParticles: 10,
        pos: {
          x: 0,
          y: 0,
        },
        addAtBack: false,
        spawnType: 'circle',
        spawnCircle: {
          x: 0,
          y: 0,
          r: 10,
        },
      }
    );

    this.theShooter.game.app.stage.addChild(this.particleContainer);


  }

  emitExplosion()
  {
    this.createEmmiter();
    this.particleContainer.x = this.x;
    this.particleContainer.y = this.y;
    this.emitter.textures = this.emitter_texture;

    this.emitter.emit = true;



    this.speed = null;
    this.direction = null;
    this.texture = null;
    this.x = null;
    this.y = null;
   // this.destroied = true;

    // Play the emitter's animation
    // this.emitter.playOnce();
  }

}
