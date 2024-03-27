let gameScene = new Phaser.Scene('Game');



gameScene.preload = function(){
    this.load.image('background',"assets/oak_woods_v1.0/oak_woods_v1.0/background/background_layer_1.png");
    this.load.image('ground',"assets/Starter Tiles Platformer/BasicGreenGrid.png");
    this.load.image('coin',"assets/Starter Tiles Platformer/coin.png");
    this.load.tilemapTiledJSON('tilemap', 'assets/Starter Tiles Platformer/Ground.json');
    this.load.atlas('knight', 'assets/knight.png', 'assets/knight.json');
    //preload finished
};

gameScene.create = function(){
    
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
            framerate: 1,
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
    // Create world bounds and set their label
    let topWall = this.matter.add.rectangle(this.sys.game.config.width / 2, -10, this.sys.game.config.width, 20, { isStatic: true, label: 'World Bounds' });
    let bottomWall = this.matter.add.rectangle(this.sys.game.config.width / 2, this.sys.game.config.height + 10, this.sys.game.config.width, 20, { isStatic: true, label: 'World Bounds' });
    let leftWall = this.matter.add.rectangle(-10, this.sys.game.config.height / 2, 20, this.sys.game.config.height, { isStatic: true, label: 'World Bounds' });
    let rightWall = this.matter.add.rectangle(this.sys.game.config.width + 10, this.sys.game.config.height / 2, 20, this.sys.game.config.height, { isStatic: true, label: 'World Bounds' });

    this.cursors = this.input.keyboard.createCursorKeys(); //Getting input from keyboard

    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('forest set', 'ground')
    
    const ground = map.createLayer('Layer', tileset)
    ground.setCollisionByProperty({ collide: true });


    this.matter.world.convertTilemapLayer(ground);

    const objectsLayer = map.getObjectLayer('objects')

    objectsLayer.objects.forEach(objData => {
        const{x,y,name} = objData
        switch(name)
        {
        case 'knightspawn':
        {
            this.knight = this.matter.add.sprite(x,y,'knight')
            .setOrigin(0.5,0.5);
            this.knight.setBody({ //hitbox for knight
                type: 'rectangle',
                width: 20,
                height: 43,
                allowRotation: false
            })
        this.knight.body.position.y -=18; //This code centers hitbox on knights body
        this.knight.body.position.x +=3;
        this.knight.setFixedRotation(true);
        this.cameras.main.startFollow(this.knight);
        this.matter.world.on('collisionstart', (event, pair) => {
            // Check if the knight is one of the bodies and if it collided with the bottom wall
            if ((pair.bodyA === this.knight.body && pair.bodyB === bottomWall.body) || 
                (pair.bodyB === this.knight.body && pair.bodyA === bottomWall.body)) {
                // Destroy the knight
                this.knight.destroy();
            
                // Respawn the knight at the original position
                this.knight = this.matter.add.sprite(x, y, 'knight');
            }
        });
        
    
        this.knight.setOnCollide((data) => {
            this.isTouching = true
            
        });
        }
        case 'coin':
            {
                const coin = this.matter.add.sprite(x,y,'coin')
                .setOrigin(0.5,0.5);
                coin.setBody({
                    type: 'circle',
                    radius: 10
                });
                coin.setStatic(true);
                coin.setSensor(true);
                coin.setOnCollide(() => {
                    coin.destroy();
                });
            }    
        }
    });

    this.knight.setFixedRotation(true);

    this.cameras.main.startFollow(this.knight);

    this.cameras.main.setZoom(1.5);

   
    




//create finished
};


gameScene.update = function()
{
    const speed = 1.25;
    const spacebar_pressed = Phaser.Input.Keyboard.JustDown(
        this.cursors.space)
    this.knight.setSize(10,10,true)
    if (spacebar_pressed && this.isTouching)
   {
    this.knight.setVelocityY(-9)
    this.isTouching = false;
    this.knight.play('jump', true)
   }
   else if(this.cursors.left.isDown){
    this.knight.play('rrun', true)
    this.knight.setVelocityX(-speed)
    
   }
   else if (this.cursors.right.isDown){
    this.knight.play('frun', true)
    this.knight.setVelocityX(speed)
   }
   else
   {
    if (!this.knight.anims.isPlaying || (this.knight.anims.currentAnim && this.knight.anims.currentAnim.key !== 'jump')) {
        this.knight.setVelocityX(0)
        this.knight.play('idle', true)
    }
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