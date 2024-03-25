let gameScene = new Phaser.Scene('Game');



gameScene.preload = function(){
    this.load.image('background',"assets/oak_woods_v1.0/oak_woods_v1.0/background/background_layer_1.png");
    this.load.image('ground',"assets/Starter Tiles Platformer/BasicGreenGrid.png");
    this.load.tilemapTiledJSON('tilemap', 'assets/Starter Tiles Platformer/Ground.json');
    this.load.spritesheet('knight_idle',"assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Idle.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('knight_run',"assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Run.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('knight_jump',"assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Jump.png", { frameWidth: 120, frameHeight: 80 });
    this.load.spritesheet('knight_fall',"assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Fall.png", { frameWidth: 120, frameHeight: 80 });
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

    this.cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('forest set', 'ground')
    
    const ground = map.createLayer('Layer', tileset)
    ground.setCollisionByProperty({ collide: true });

    this.matter.world.convertTilemapLayer(ground);


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
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('knight_jump', { start: 0, end: 2 }), // Adjust frame range accordingly
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('knight_jump', { start: 0, end: 2 }), // Adjust frame range accordingly
        frameRate: 10,
        repeat: -1
    });
   this.knight = this.matter.add.sprite(50,250, 'knight_idle')
        .play('idle');
        this.knight.setBody({
            type: 'rectangle',
            width: 20, // Adjust width and height according to your knight sprite
            height: 30,
            density: 0.5,
            friction: 0.5,
            restitution: 0.2
        });
        this.knight.setFixedRotation();

    console.log("Create finished");
};


gameScene.update = function()
{
    const speed = 1.25;

   if(this.cursors.left.isDown){
    this.knight.play('run')
    this.knight.setVelocityX(-speed)
    
   }
   else if (this.cursors.right.isDown){
    this.knight.play('run')
    this.knight.setVelocityX(speed)
   }
   else
   {
    this.knight.setVelocityX(0)
    this.knight.play('idle')
   }
};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true
        }
    }
};

let game = new Phaser.Game(config);