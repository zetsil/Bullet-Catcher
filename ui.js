import Projectile from './projectile.js';
import UpdateTypes from './updateTypes.js'; // Adjust the path as necessary

export default class UI extends PIXI.Container {
    constructor(game) {
        super();
        this.game = game;

        this.blue_bullet_spot = new PIXI.Sprite(game.loader.resources.blue_spot_empty.texture);
        this.blue_bullet_spot.anchor.set(0.5);
        this.blue_bullet_spot.x = -40;
        this.blue_bullet_spot.y = -20 ;
        this.blue_bullet_spot.scale.x = 0.8;
        this.blue_bullet_spot.scale.y = 0.8;

        this.game.wizard.addObserver(this);

        this.yellow_bullet_spot = new PIXI.Sprite(game.loader.resources.yellow_spot_empty.texture);
        this.yellow_bullet_spot.anchor.set(0.5);
        this.yellow_bullet_spot.x = -60;
        this.yellow_bullet_spot.y = -20 ;
        this.yellow_bullet_spot.scale.x = 0.8;
        this.yellow_bullet_spot.scale.y = 0.8;

        this.pink_bullet_spot = new PIXI.Sprite(game.loader.resources.pink_spot_empty.texture);
        this.pink_bullet_spot.anchor.set(0.5);
        this.pink_bullet_spot.x = -80;
        this.pink_bullet_spot.y = -20 ;
        this.pink_bullet_spot.scale.x = 0.8;
        this.pink_bullet_spot.scale.y = 0.8;

        this.bulletSpotMap = new Map();
        this.bulletSpotMap.set('blue', this.blue_bullet_spot);
        this.bulletSpotMap.set('yellow', this.yellow_bullet_spot);
        this.bulletSpotMap.set('pink', this.pink_bullet_spot);

        
        this.cards = []; // lvl up cards there only be 3 at a time
        this.cardDeck = new CardDeck(); // draw the cards from here
        this.createCards();
        this.show_up_lvl_screen = false;

        
        this.x = this.game.wizard.x
        this.y = this.game.wizard.y;
        this.addChild(this.blue_bullet_spot);
        this.addChild(this.yellow_bullet_spot);
        this.addChild(this.pink_bullet_spot);
        this.game.wizard.addChild(this);



        this.WizardhealthBarEmpty = new PIXI.Graphics();
        this.WizardhealthBarEmpty.beginFill(0xA0A0A0);
        this.WizardhealthBarEmpty.drawRect(-25, -40, 80, 5);
        this.WizardhealthBarEmpty.endFill();
        this.addChild(this.WizardhealthBarEmpty);


        this.WizardhealthBar = new PIXI.Graphics();
        this.WizardhealthBar.beginFill(0x225128);
        this.WizardhealthBar.drawRect(-25, -40, 80, 5);
        this.WizardhealthBar.endFill();
        this.addChild(this.WizardhealthBar)

        const screenWidth = this.game.app.renderer.width;
        const screenHeight = this.game.app.renderer.height;

        // Calculate the center position
        const barWidth = 200;
        const barHeight = 10;
        const barX = (screenWidth / 7) - (barWidth )  ;  // Center horizontally
        const barY = -screenWidth/3; // Center vertically

        // Create the background of the XP bar (empty state)
        this.XPBarEmpty = new PIXI.Graphics();
        this.XPBarEmpty.beginFill(0xFFFFFF); // with  background
        this.XPBarEmpty.drawRect(barX, barY, barWidth, barHeight);
        this.XPBarEmpty.endFill();
        this.addChild(this.XPBarEmpty);
        this.XPBarEmpty.x = barX

        // Create the filled XP bar
        this.XPBar = new PIXI.Graphics();
        this.XPBar.beginFill(0x6A0DAD); // Purple color for the XP bar
        this.XPBar.y = barY
        this.XPBar.drawRect(barX, barY, barWidth, barHeight);
        this.XPBar.endFill();
        this.addChild(this.XPBar);

        // Add "XP" text beside the XP bar
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial', // You can change the font as needed
            fontSize: 16,
            fill: '#6A0DAD', // White color
            align: 'left',
        });

        const xpText = new PIXI.Text('XP', style);
        xpText.x = barX + barWidth - 50; // Position it to the right of the bar with some padding
        xpText.y = barY - (xpText.height / 2) + (barHeight / 2); // Vertically center the text relative to the bar
        this.addChild(xpText);

    }
    updateState(subject, updateType) {
        switch (updateType) {
            case UpdateTypes.HEALTH:
                this.updateHealth(subject.currentHealth,subject.totalHealth);
                break;
            case UpdateTypes.XP :
                this.updateXP(subject.currentXP, subject.nextLevelXP); 
            case UpdateTypes.FILL_SPOT:
                this.updateBulletSpace(subject.bullet_holder);
                break;
            default:
                console.log('Unknown update type '+ updateType);
                break;
        }
    }

    updateHealth(currentHealth,totalHealth) {
        // Update health-related UI elements
        const healthPercentage = this.getHealthPercentage(currentHealth,totalHealth);
        this.WizardhealthBar.width = healthPercentage / 100 * 80; // Update the health bar width
    }

    updateBulletSpace(bulletHolder) {

        // Starting positions
        const initialStartX = -80; // Initial starting X position
        const startY = -20; // Initial starting Y position
        const spacing = 20; // Adjust spacing between bullets
        
        console.log("Update projectile-related UI element");
        // Iterate over the bullets in the BulletHolder
        bulletHolder.order.forEach((bullet , index) => {
        const bulletSpot = this.bulletSpotMap.get(bullet.type);
        console.log(bulletSpot)
        if (bulletSpot) {
            if (bullet.isFull()) {
                // Change the color or texture of the bullet spot to indicate the bullet is full
                bulletSpot.texture = this.game.loader.resources[`${bullet.type}_spot_full`].texture; // Full texture // Example: Green tint for full bullets
            } else {
                // Revert the color or texture if the bullet is not full
                bulletSpot.texture = this.game.loader.resources[`${bullet.type}_spot_empty`].texture; // Example: White tint for empty bullets
            }
        // Reposition the bullet spot sprite
        bulletSpot.x = initialStartX + index * spacing;
        bulletSpot.y = startY;
        }
    });
    }

    getHealthPercentage(currentHealth,totalHealth) {
        return currentHealth / totalHealth * 100;
      }

    updateXP(currentXP, nextLevelXP) {
        // Calculate the XP percentage
        const xpPercentage = currentXP / nextLevelXP;
    
        // Calculate the new width of the XP bar based on the percentage
        const newBarWidth = 200 * xpPercentage; // Assuming the total width is 80
    
        // Clear the previous bar and draw the new one
        this.XPBar.clear();
        this.XPBar.beginFill(0x6A0DAD); // Purple color for the XP bar
        this.XPBar.drawRect(this.XPBarEmpty.x- 87, this.XPBarEmpty.y, newBarWidth, 10);
        this.XPBar.endFill();

        if (this.game.wizard.currentXP >= this.game.wizard.nextLevelXP) {
            this.XPBar.clear();
            // Increase the level
            this.game.wizard.lvl += 1;
            
            // Calculate leftover XP after leveling up
            this.game.wizard.currentXP -= this.game.wizard.nextLevelXP;
    
            // Increase the XP required for the next level
            // For example, increase by 20% or any other logic you prefer
            this.game.wizard.nextLevelXP = Math.floor(this.game.wizard.nextLevelXP * 2);
            // Stop the game and show the level-up screen
            this.show_up_lvl_screen = true;
        }
    }

    createCards(){
        // Define text style
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 12,
            fill: '#000000', // Black color
            align: 'center',
        });
        const textStyleGold = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fill: '#DAA520', // Black color
            align: 'center',
        });
        // Create a card instance
        const iconTexture_heal = new PIXI.Texture.from("heal_icon")
        const iconTexture_atack = new PIXI.Texture.from("buff_arm")
        const iconTexture_speed = new PIXI.Texture.from("speed_icon")
        const iconTexture_freez = new PIXI.Texture.from("ice_storm")
        const iconTexture_life = new PIXI.Texture.from("life_increase")
        const strength_card = new Card('atack', 200, 300, 0xFFFFFF, iconTexture_atack, "Increase the attack power of bullets", textStyle, this.increaseAtack.bind(this));
        const spead_card = new Card('speed', 200, 300, 0xFFFFFF, iconTexture_speed, "Increase movement speed", textStyle, this.increaseSpeed.bind(this));
        const magic_heal_card = new Card('heal', 200, 300, 0xFFFFFF, iconTexture_heal, "Heal when you have \n one pink bullet", textStyleGold, this.activateHeal.bind(this));
        this.cards.push(strength_card)
        this.cards.push(spead_card)
        this.cards.push(magic_heal_card)


        const lvl1Strength_card = new Card('atack', 200, 300, 0xFFFFFF, iconTexture_atack, "Increase the attack power of bullets", textStyle, this.increaseAtack.bind(this));
        const lvl1Spead_card = new Card('speed', 200, 300, 0xFFFFFF, iconTexture_speed, "Increase movement speed", textStyle, this.increaseSpeed.bind(this));
        const lvl1LifeIncrease_card = new Card('life', 200, 300, 0xFFFFFF, iconTexture_life, "Increase max health", textStyle, this.increasLife.bind(this));
        const lvl1Magic_freez_card = new Card('freez', 200, 300, 0xFFFFFF, iconTexture_freez, "Freez Enemy \n when you have one blue bullet", textStyleGold, this.activateFreez.bind(this));
        
        this.cardDeck.addCard(1, lvl1Magic_freez_card);
        this.cardDeck.addCard(1, lvl1Strength_card);
        this.cardDeck.addCard(1, lvl1Spead_card);
        this.cardDeck.addCard(1, lvl1LifeIncrease_card);
    }

    
showLevelUpScreen() {
    // 1. Stop the game loop
    this.game.pause_game = true;
    Projectile.is_visible = false;

    // 2. Create a transparent grey background centered around the wizard
    this.overlay = new PIXI.Graphics();
    this.overlay.beginFill(0x000000, 0.5); // Black color with 50% opacity

    // Get the dimensions of the renderer
    const rendererWidth = this.game.app.renderer.width;
    const rendererHeight = this.game.app.renderer.height;

    // Calculate the top-left position for the overlay to center it around the wizard
    const overlayX = -this.game.app.renderer.width/2 + 50;
    const overlayY = -this.game.app.renderer.height/2 + 50;
    // Draw the overlay rect with the dimensions of the renderer
    this.overlay.drawRect(overlayX, overlayY, rendererWidth, rendererHeight);
    this.overlay.endFill();
    this.addChild(this.overlay);
    // 3. Position and display the cards
    const cardSpacing = 50; // Space between the cards
    const totalWidth = this.cards.length * 200 + (this.cards.length - 1) * cardSpacing; // Width of all cards and spacing
    let startX = overlayX + (rendererWidth - totalWidth) / 2; // Start position to center the cards within the overlay
    let startY = overlayY + (rendererHeight / 2) - (this.cards[0].height / 2); // Vertically center the cards within the overlay

    this.cards.forEach((card, index) => {
        card.x = startX + index * (200 + cardSpacing); // Position each card horizontally
        card.y = startY; // Vertically center the card within the overlay
        this.addChild(card); // Add the card to the stage
    });

    this.cards.forEach((card, index) => {
        // Position each card horizontally
        card.x = startX + index * (200 + cardSpacing);
        card.y = startY; // Vertically center the card within the overlay
        
        // Add the card to the stage
        this.addChild(card);

        // Ensure there are no duplicate event listeners
        card.removeAllListeners();
        
        // Add interactivity to the card
        card.interactive = true;
        card.buttonMode = true;
    
        card.on('pointerover', () => {
            card.background.tint = 0xAAAAAA; // Change color on hover
        });
    
        card.on('pointerout', () => {
            card.background.tint = 0xFFFFFF; // Revert color when not hovered
        });
    
        card.on('pointerdown', () => {
            this.onCardSelected(card, index); // Handle card selection
        });
    });
}

// Method to handle card selection
onCardSelected(selectedCard, index) {
    console.log("Card selected:", selectedCard);
    
    // Remove the cards and overlay from the stage
    this.cards.forEach(card => {
        this.removeChild(card);
    });
    
    this.removeChild(this.overlay); // Remove all children including the overlay

    // Resume the game loop
    this.game.pause_game = false;
    Projectile.is_visible = true;
    // Perform the ability upgrade based on the selected card
    this.upgradeAbility(selectedCard);
    this.removeSelectedCard(selectedCard, index);
    // Draw a new card from the deck and add it to the cards array
    const newCard = this.cardDeck.drawCard();
    if (newCard) {
        this.cards.push(newCard);
    } else {
        console.log("No new cards available in the deck."); // Log if no cards are left
    }
}

removeSelectedCard(card, index) 
{
    console.log("CARD REMOVEEED !")
    this.cards.splice(index, 1);
}

// Dummy method for upgrading ability, to be implemented according to your game logic
upgradeAbility(selectedCard) {
    // Implement the logic to upgrade the wizard's ability based on the selected card
    selectedCard.updateStat();
}

increaseAtack(){
    this.game.wizard.strength += 0.5; 
}

increaseSpeed(){
    this.game.wizard.speed += 0.3;
}

activateFreez(){
    // implement freez spell
}

increasLife(){
    this.game.wizard.totalHealth +=2;
    this.game.wizard.currentHealth = this.game.wizard.totalHealth;
}

activateHeal(){
    this.game.wizard.spells.heal = true;
}

update(){
    if (this.show_up_lvl_screen){
        this.showLevelUpScreen();
        this.show_up_lvl_screen = false;
    }
}

}


class Card extends PIXI.Container {
    constructor(type, width, height, backgroundColor, iconTexture, text, textStyle, updateStat) {
        super(); // Call the constructor of PIXI.Container
        this.type = type;

        // Create and draw the card background
        this.background = new PIXI.Graphics();
        this.background.beginFill(backgroundColor);
        this.background.drawRoundedRect(0, 0, width, height, 10); // Rounded corners
        this.background.endFill();
        this.addChild(this.background); // Add background to the card container

        // Create and add the icon
        if (iconTexture) {
            this.icon = new PIXI.Sprite(iconTexture);
            this.icon.width = width / 2; // Set icon width (e.g., 25% of card width)
            this.icon.height = this.icon.width; // Keep aspect ratio square
            this.icon.x = width / 2 - this.icon.width / 2; // Center icon horizontally
            this.icon.y = height / 4 - this.icon.height / 2; // Position icon in the upper part of the card
            this.addChild(this.icon); // Add icon to the card container
        }

        // Create and add the text
        if (text) {
            this.labelText = new PIXI.Text(text, textStyle);
            this.labelText.x = width / 2 - this.labelText.width / 2; // Center text horizontally
            this.labelText.y = (height * 3) / 4 - this.labelText.height / 2; // Position text in the lower part of the card
            this.addChild(this.labelText); // Add text to the card container
        }

        // Store the updateStat Function for later use
        this.updateStat = updateStat;
    }

    // Method to update the text on the card
    updateText(newText) {
        if (this.labelText) {
            this.labelText.text = newText;
            this.labelText.x = this.width / 2 - this.labelText.width / 2; // Re-center text
        }
    }

    // Method to update the icon on the card
    updateIcon(newIconTexture) {
        if (this.icon) {
            this.icon.texture = newIconTexture;
        }
    }


    
}

class CardDeck {
    constructor() {
        this.levels = [
            { level: 1, cards: [] },
            { level: 2, cards: [] },
            { level: 3, cards: [] }
        ];
        this.currentLevelIndex = 0;
    }

    addCard(level, card) {
        this.levels[level - 1].cards.push(card);
    }

    drawCard() {
        const currentLevel = this.levels[this.currentLevelIndex];
        if (currentLevel.cards.length > 0) {
            const drawnCard = currentLevel.cards.pop();
            console.log(`Drawn from Level ${currentLevel.level}:`, drawnCard);
            console.log(currentLevel.cards.length)
            
            if (currentLevel.cards.length === 0) {
                this.currentLevelIndex++;
                console.log(`Moving to Level ${this.currentLevelIndex + 1}`);
            }
            return drawnCard;
        } else {
            console.log(`No cards left in Level ${currentLevel.level}`);
        }
    }
}
