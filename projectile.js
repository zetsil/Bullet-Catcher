// Constructor for the Projectile class
// Parameters:
// - texture: the texture for the projectile sprite
// - speed: the speed at which the projectile moves
// - direction: the direction in radians that the projectile moves in
// - theShooter: the theShooter object from witch the projectil is shoot 
export default class Projectile extends PIXI.Sprite {
    constructor(texture,speed,direction,theShooter) {
      super(texture);
      this.speed = speed;
      this.direction = direction;
      this.theShooter = theShooter;
      this.maxDistance = 3000; // maxDistance radiuse for the projectile center having the enemy 
      this.anchor.set(0.5); // Set the anchor point of the sprite to its center
      this.type = "blue";

    }
    // Update function for the Projectile class
    // Moves the projectile in the specified direction and checks if it has exceeded its maximum distance
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
      }
    // Destroy function for the Projectile class
    // Removes the sprite from its parent container and cleans up its properties
    destroy() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.speed = null;
        this.direction = null;
        this.texture = null;
        this.x = null;
        this.y = null;
      }

    checkCollision(sprite) {
        return this.hitTestRectangle(this, sprite);
      }  

    hitTestRectangle(r1, r2) {
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
        
  }
