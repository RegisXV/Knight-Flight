let gameScene = new Phaser.Scene('Game');



gameScene.preload = function(){
    this.load.image('background',"assets/oak_woods_v1.0/oak_woods_v1.0/background/background_layer_1.png");
    this.load.image('ground',"assets/Starter Tiles Platformer/BasicGreenGrid.png");
    this.load.tilemapTiledJSON('tilemap', 'assets/Starter Tiles Platformer/Ground.json');
    this.load.atlas('knight', 'assets/knight.png', 'assets/knight.json');
    //preload finished
};
    knight:Phaser.Physics.Matter.Sprite

gameScene.create = function(){
    knight:Phaser.Physics.Matter.Sprite
    const knight_animations = () =>
    {
        this.anims.create({
            key:'idle',
            framerate: 1,
            frames: this.anims.generateFrameNames('knight',{
                frames:[0,1,3,4,5,7,8,9],
                prefix: 'idle',
                suffix: '.png'
        }),
            repeat: -1
        })
        this.anims.create({
            key:'frun',
            framerate: 2,
            frames: this.anims.generateFrameNames('knight',{
                start:0,
                end:9,
                prefix: 'frun',
                suffix: '.png'
        }),
            repeat: -1
        })
        this.anims.create({
            key:'rrun',
            framerate: 2,
            frames: this.anims.generateFrameNames('knight',{
                start:9,
                end:0,
                prefix: 'rrun',
                suffix: '.png'
        }),
            repeat: -1
        }) 
        this.anims.create({
            key:'jump',
            framerate: 2,
            frames: this.anims.generateFrameNames('knight',{
                start:0,
                end:2,
                prefix: 'jump',
                suffix: '.png'
        }),
            repeat: -1
        })          
    }
    knight_animations();
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

    this.knight = this.matter.add.sprite(40,245,'knight')
        .setOrigin(0.5,0.5);
    this.knight.setBody({
        type: 'rectangle',
        width: 20,
        height: 43,
        allowRotation: false
    })
    this.knight.body.position.y -=18;
    this.knight.body.position.x +=3;

    this.knight.setFixedRotation(true);

    this.cameras.main.startFollow(this.knight);

    this.cameras.main.setZoom(1.5);
    




//create finished
};


gameScene.update = function()
{
    const speed = 500;
    this.knight.setSize(10,10,true)

   if(this.cursors.left.isDown){
    this.knight.play('rrun', true)
    this.knight.setVelocityX(-speed)
    
   }
   else if (this.cursors.right.isDown){
    this.knight.play('frun', true)
    this.knight.setVelocityX(speed)
   }
   else
   {
    this.knight.setVelocityX(0)
    this.knight.play('idle', true)
   }
   const spacebar_pressed = Phaser.Input.Keyboard.JustDown(
    this.cursors.space)
   if (spacebar_pressed)
   {
    this.knight.setVelocityY(-9)
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