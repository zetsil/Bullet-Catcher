import UpdateTypes from "./updateTypes.js";
import Projectile from "./projectile.js";
export default class Magic{

    constructor(wizard)
    {
        this.wizard = wizard;
        this.heal = false;
        // Destructurare pentru a obține atât emitter-ul, cât și container-ul
        let heal_texture = new PIXI.Texture.from('heal');
        this.ice_cub_texture = new PIXI.Texture.from('ice_cub');
        this.ice_particle_texture = new PIXI.Texture.from('ice_particle');
        const { emitter, particleContainer } = this.createEmitterHeal(heal_texture);

        // Stochează emitter-ul și container-ul separat
        this.heal_effect_emitter = emitter;
        this.heal_particle_container = particleContainer;
        this.wizard.addChild(this.heal_particle_container);
    }

    emitHealing(pos_x,pos_y){

        // Prevent starting a new emission if one is already ongoing
        if (this.heal_effect_emitter.emit) return;

        if(this.wizard.currentHealth > this.wizard.totalHealth)
            this.wizard.currentHealth = this.wizard.totalHealth
            this.wizard.notifyObservers(UpdateTypes.HEALTH);
            // Empty the bullet at the first position
            this.wizard.bullet_holder.emptyBullet('pink');
            this.wizard.heal_sound.play()
            this.wizard.notifyObservers(UpdateTypes.FILL_SPOT);
            this.wizard.notifyObservers(UpdateTypes.PROJECTILE_COUNT_CHANGED);

        this.heal_effect_emitter.emit = true;
        setTimeout(() => {
            // Stop emitting particles after 500 milliseconds (or adjust this time as needed)
            this.heal_effect_emitter.emit = false;
        }, 500); // 500 milliseconds here corresponds to how long you want the burst to last.
            
    }

    updateState(subject, updateType, angle) 
    {
        if (updateType === UpdateTypes.HEAL) 
        {
            this.emitHealing(subject.x,subject.y);
        }
        if (updateType === UpdateTypes.FREEZ) 
        {
            console.log(this.wizard)
            this.shootProjectileFreez(this.wizard,angle,this.ice_cub_texture,this.ice_particle_texture);
        }
    }
      

    createEmitterHeal(texture) {
        // Creează un container pentru particule
        let particleContainer = new PIXI.ParticleContainer();
        let emitter_texture = texture;
    
        // Creează un emitter de particule
        let emitter = new PIXI.particles.Emitter(
        // Container-ul în care se vor afișa particulele
        particleContainer,

        // Textura particulelor
        [emitter_texture],

        // Configurația emitter-ului
        {
        alpha: { start: 1, end: 0 },
        scale: { start: 1, end: 0.3 },
        color: { start: 'ffffff', end: 'ff0000' },
        speed: { start: 200, end: 50 },
        scale: {start: 2, end: 1,},
        startRotation: { min: 0, max: 360 },
        rotationSpeed: { min: -100, max: 100 },
        lifetime: { min: 0.5, max: 0.5 },
        blendMode: 'normal',
        frequency: 0.03, // Increase frequency to spawn all particles at once in a burst
        minParticles: 100,
        maxParticles: 400, // Emit between 10 and 40 particles in the burst
        pos: { x: 0, y: 0 },
        addAtBack: false,
        spawnType: 'circle',
        spawnCircle: { x: 0, y: 0, r: 10 },
        }
        );
        emitter.emit = false;



        // Returnează atât emitter-ul, cât și container-ul
    return {
        emitter: emitter,
        particleContainer: particleContainer
    };

    }

    shootProjectileFreez(wizard,angle,texture,particle_texture) {

        // Get the type of the bullet at the first position
        const firstBulletType = wizard.bullet_holder.getFirstPosition().type;
    
         // Check if there is a bullet at the first position and it is full
        if (firstBulletType && wizard.bullet_holder.bullets[firstBulletType].full) 
        {
          // Empty the bullet at the first position
          wizard.bullet_holder.emptyBullet(firstBulletType);
          wizard.notifyObservers(UpdateTypes.FILL_SPOT);
          wizard.notifyObservers(UpdateTypes.PROJECTILE_COUNT_CHANGED)
    
          // Play shooting sound
          wizard.shoot_sound.play();
        }
        else
          // don't shoot , you don t have eny bullets
          return;
    
        const projectile = new WizardProjectileFreez(texture, 9, angle, this.wizard, particle_texture);
        // Alternatively, you can use a uniform scale:
        projectile.x = wizard.x; // spawn the projectile in front of the Player/Wizard
        projectile.y = wizard.y;
        wizard.game.app.stage.addChild(projectile); // add projectile sprite to stage 
        wizard.wizardProjectiles.push(projectile); // add the projectile to a list for collision detection
      }

    update(delta) {
        if (this.heal_effect_emitter) {
            // Delta este timpul dintre cadre și se folosește pentru a actualiza emitter-ul
            this.heal_effect_emitter.update(delta * 0.01);

        }
    }


}


class WizardProjectileFreez extends Projectile {

    constructor(texture,speed,angle,theShooter,ice_particle_texture){
      super(texture,speed,angle,theShooter);
      this.ice_particle = ice_particle_texture;
      this.scale.set(0.03);  // Scale down uniformly by 50%
      this.explode_timeout = 100;  // increase emmiter time
    }
    //overide function
    update() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;
      const dx = this.x - this.theShooter.sprite.x;
      const dy = this.y - this.theShooter.sprite.y;
      this.type = "ice";
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
        this.emitter.emit = true;
        this.emitter.update(0.009);
        this.explode_timeout--;
      }
  
      if (this.explode_timeout == 0) {
        this.emitter.emit = false;
        this.destroy();
  
      }
  
    }
    //overide function
    createEmmiter(){
        // Creează un container pentru particule
        let particleContainer = new PIXI.ParticleContainer();
        let emitter_texture = this.ice_particle;
        // Creează un emitter de particule
        let emitter = new PIXI.particles.Emitter(
            // Container-ul în care se vor afișa particulele
            particleContainer,
    
            // Textura particulelor
            [emitter_texture],
    
            // Configurația emitter-ului
            {
                alpha: { start: 1, end: 0 },
                scale: { start: 1.5, end: 0.5 },  // Particles start larger and shrink
                color: { start: 'ffffff', end: 'a0e9ff' },  // White to icy blue
                speed: { start: 300, end: 50 },  // Fast initial burst, then slows down
                startRotation: { min: 0, max: 360 },  // Random initial rotation
                rotationSpeed: { min: -50, max: 50 },  // Slower rotation for icy particles
                lifetime: { min: 0.8, max: 1.2 },  // Particles last slightly longer
                blendMode: 'add',  // Additive blend mode for a glowing icy effect
                frequency: 0.05,  // Spawns particles quickly but not all at once
                minParticles: 50,
                maxParticles: 200,  // Emits between 50 and 200 particles
                pos: { x: 0, y: 0 },
                addAtBack: false,
                spawnType: 'burst',  // Snow explosion effect
                particlesPerWave: 50,
                particleSpacing: 0,
                angleStart: 0,
                spawnCircle: { x: 0, y: 0, r: 20 },  // Circular explosion
            }
        );
        
    
        // Seteaz atât emitter-ul, cât și container-ul
        this.emitter = emitter;
        this.particleContainer = particleContainer;
        this.theShooter.game.app.stage.addChild(this.particleContainer)
    }
  }