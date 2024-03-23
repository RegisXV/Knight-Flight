let gameScene = new Phaser.Scene('Game');

gameScene.preload = function(){
    this.load.image('background',"assets/oak_woods_v1.0/oak_woods_v1.0/background/background_layer_1.png");
    this.load.image('ground',"assets")
    this.load.spritesheet('knight_idle',"assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Idle.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('knight_run',"assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Run.png", { frameWidth: 120, frameHeight: 80 });
    //this.load.spritesheet('fire', "assets/fire_fx_v1.0/fire_fx_v1.0/png/blue/loops/burning_loop_1.png",{frameWidth: 120, frameHeight: 80});
    console.log("Preload finished");
};

gameScene.create = function(){
    let background = this.add.sprite(0, 0, 'background'); // Set position to (0, 0)
    
    // Resize background image
    let scaleX = game.config.width / background.width; // Calculate scale based on game width
    let scaleY = game.config.height / background.height; // Calculate scale based on game height
    background.setScale(scaleX, scaleY);

     background.setOrigin(0); // Set origin to top-left corner
    background.setPosition(0, 0); // Set position to (0, 0)
    
    this.player = this.physics.add.sprite(50, 250, 'knight_idle');


    

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('knight_idle',{ start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('knight_run', { start: 0, end: 9 }), // Adjust frame range accordingly
        frameRate: 10,
        repeat: -1
    });
    this.player.anims.play('idle', true);

    console.log("Create finished");
};

gameScene.update = function(){
   
};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

let game = new Phaser.Game(config);