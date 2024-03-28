let gameScene = new Phaser.Scene('Game');



gameScene.preload = function(){
    this.load.image('background',"assets/oak_woods_v1.0/oak_woods_v1.0/background/background_layer_1.png");
    this.load.image('ground',"assets/Starter Tiles Platformer/BasicGreenGrid.png");
    this.load.image('coin',"assets/Starter Tiles Platformer/coin.png");
    this.load.tilemapTiledJSON('tilemap', 'assets/Starter Tiles Platformer/Ground.json');
    this.load.atlas('knight', 'assets/knight.png', 'assets/knight.json');
    this.load.image('reset', 'assets/reset.png');
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

    const objectsLayer = map.getObjectLayer('objects');


    // Create win text and hide it initially
    this.winText = this.add.text(this.sys.game.config.width / 2, (this.sys.game.config.height / 2)-100, 'You win!', { fontSize: '64px', fill: '#000' });
    this.winText.setOrigin(0.5);
    this.winText.visible = false;

    // Create reset button and hide it initially
    this.resetButton = this.add.sprite(this.sys.game.config.width / 2, (this.sys.game.config.height / 2) + 25, 'reset');
    this.resetButton.setScale(0.1);
    this.resetButton.setInteractive();
    this.resetButton.visible = false;
    this.resetButton.on('pointerdown', () => {
        // Reset game here
        this.scene.restart();
    });


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
        this.score = 0;
        this.scoreText = this.add.text(this.cameras.main.scrollX + 16, this.cameras.main.scrollY + 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
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
                const coin = this.matter.add.sprite(x,y,'coin').setOrigin(0.5,0.5);
                const totalCoins = (objectsLayer.objects.filter(obj => obj.name === 'coin').length)+1;
                
                coin.setBody({
                    type: 'circle',
                    radius: 7
                });
                coin.setStatic(true);
                coin.setSensor(true);
                coin.setOnCollide(() => {
                    coin.destroy();
            
                    // Increase score
                    this.score += 1;
                    this.scoreText.setText('Score: ' + this.score);
            
                    // Check if all coins have been collected
                    if (this.score === totalCoins) {
                        // Show win text and reset button
                        this.winText.visible = true;
                        this.resetButton.visible = true;
                    }
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
    this.scoreText.setPosition(this.cameras.main.scrollX + 16, this.cameras.main.scrollY + 16);
    this.winText.setPosition(this.cameras.main.scrollX + this.sys.game.config.width / 2, this.cameras.main.scrollY + this.sys.game.config.height / 2);
    this.resetButton.setPosition(this.cameras.main.scrollX + this.sys.game.config.width / 2, this.cameras.main.scrollY + this.sys.game.config.height / 2 + 100);
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
            debug: false
        }
    }
};

let game = new Phaser.Game(config);