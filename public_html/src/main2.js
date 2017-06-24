/* global Phaser */

//custom script

// WEBGL or HTML canvas? Phaser.AUTO

var HEIGHT = 800;
var WIDTH = 600;

var game = new Phaser.
    Game(HEIGHT, WIDTH, Phaser.AUTO, 'gameCanvas', 
    {
        preload: preload,
        create: create,
        update: update
//        render: render
    }
            );

var background,paddle,ball,bricks;

var score = 0;
var lives = 3;

var scoreText = "";
var livesText = "";
var gameOverText = "";
var bHasLaunched = false;

var holdBall = false;
var highscore;

var game_over_music,crash_music;

function preload(){
   game.load.image("background","resources/background.png");
   game.load.image("paddle1", "resources/glasspaddle2.png");
   game.load.image("paddle2", "resources/paddle.png");
   game.load.image("ball", "resources/red-ball.png");
   game.load.image("green-brick","resources/colored_bricks/green.png");
   game.load.image("red-brick","resources/colored_bricks/red.png");
   game.load.image("blue-brick","resources/colored_bricks/blue.png");
   game.load.image("teal-brick","resources/colored_bricks/teal.png");
   
   game.load.audio('bgm', ['resources/audio/bgm.mp3']);
   game.load.audio('game_over',['resources/audio/gameover.mp3']);
   game.load.audio('crash',['resources/audio/crash.ogg']);
   
   if (localStorage.getItem("highscore") !== null) {
                highscore = parseInt(localStorage.getItem("highscore"));
   }
}

function create(){
   game.physics.startSystem(Phaser.Physics.ARCADE);
    
   background = game.add.sprite(0,0,'background');
   bg_music = game.add.audio('bgm');
   bg_music.play();
   
   game_over_music = game.add.audio('game_over');
   crash_music = game.add.audio('crash');
   
   bricks = game.add.group();
   bricks.enableBody = true;
   bricks.physicsBodyType = Phaser.Physics.ARCADE;
   
   var brickPrefab;
   
   var rowCount = 4;
   var columnCount = 10;
   
   for(var y=0; y < rowCount; y++){
       var brick_color; //default;
       
        switch(y) {
            case 0:
                brick_color = "green-brick";
                break;
            case 1:
                brick_color = "red-brick";
                break;
            case 2:
                brick_color = "teal-brick";
                break;
            case 3:
                brick_color = "blue-brick";
                break;
            default:
                brick_color = "green-brick";
        }
       for(var x=0; x < columnCount; x++){
           brickPrefab = bricks.create(100 + (x * 60), 100 + (y * 40), brick_color);
           brickPrefab.scale.y = 0.7;
           brickPrefab.body.bounce.set(1);
           brickPrefab.body.immovable = true;
       }
   }
    
   
   game.physics.arcade.checkCollision.down = false;
   
   paddle1 = game.add.sprite(game.world.centerX, 565, 'paddle1');
   paddle1.anchor.set(0.5,0.5);
//   paddle.scale.set(0.5, 0.5);
   paddle1.scale.x = 0.5;
   paddle1.scale.y = 0.2;
   
   game.physics.enable(paddle1, Phaser.Physics.ARCADE);
   paddle1.body.collideWorldBounds = true;
   paddle1.body.bounce.set(1);
   paddle1.body.immovable = true;
   
   paddle2 = game.add.sprite(game.world.centerX, 565, 'paddle2');
   paddle2.anchor.set(0.5,0.5);
//   paddle.scale.set(0.5, 0.5);
   paddle2.scale.x = 0.5;
   paddle2.scale.y = 0.2;
   
   game.physics.enable(paddle2, Phaser.Physics.ARCADE);
   paddle2.body.collideWorldBounds = true;
   paddle2.body.bounce.set(1);
   paddle2.body.immovable = true;
   
   ball = game.add.sprite(game.world.centerX,paddle1.y - 15, 'ball');
   ball.scale.set(0.4, 0.4);
   ball.anchor.set(0.5,0.5);
   ball.checkWorldBounds = true;
   
   game.physics.enable(ball, Phaser.Physics.ARCADE);
   ball.body.collideWorldBounds = true;
   ball.body.bounce.set(1);
   ball.body.immovable = false;
   
   ball.events.onOutOfBounds.add(ballReset, this);
   
//   highscoreText = game.add.text(game.world.centerX, 20, "Highscore : "+highscore, {font: "20px Arial", fill: "#000", align: "left"});
   scoreText = game.add.text(32, 20, "Score : "+score, {font: "20px Arial", fill: "#000", align: "left"});
   livesText = game.add.text(700, 20, "Lives : "+lives, {font: "20px Arial", fill: "#000", align: "right"});
   gameOverText = game.add.text(game.world.centerX, game.world.centerY - 20, "", {font: "30px Arial", fill: "#000", align: "center"});
   gameOverText.anchor.set(0.5,0.5);
//   brick = game.add.sprite(game.world.centerX,100, 'green-brick');
//   brick.scale.y = 0.5;
//   
//   game.physics.enable(brick, Phaser.Physics.ARCADE);
//   brick.body.bounce.set(1);
//   brick.body.immovable = false;
//   brick.body.collideWorldBounds = true;
//   brick.body.immovable = false;
//   
   game.input.onDown.add(launchBall, this);
   
   game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR
    ]);
}

function update(){
    
    scoreText.text = "Score "+score;
    livesText.text = "Lives "+lives;
    
    
    paddle1.x = game.input.x;
    console.log("update");
    if(!bHasLaunched){
        if(!holdBall){
            if(Math.random() > 0.5){
                holdPaddle1 = true;
                holdPaddle2 = false;
            }
            else{
                holdPaddle1 = false;
                holdPaddle2 = true;
            }
            holdBall = true;
        }
        if(holdPaddle1){
            ball.x = paddle1.x;
        }
        else if(holdPaddle2){
            ball.x = paddle2.x;
        }
        
    }
    else{
        game.physics.arcade.collide(ball, paddle1, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, paddle2, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }
    
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        paddle2.x -= 5;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        paddle2.x += 5;
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        launchBall();
    }

//    // 50 as a second parameter is a good choice if you are running 60FPS.
//    if (game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 50))
//    {
//       
//    }
}


function launchBall(){
    
    if(!bHasLaunched){
        bHasLaunched = true;
        ball.body.velocity.y = -1250;
        ball.body.velocity.x = 75;
    }
}

function ballHitPaddle(_ball, _paddle){
    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function ballHitBrick(_ball, _brick){
    _brick.kill();
    crash_music.play();
    score += 1;
    
    if(bricks.countLiving() === 0){
        bricks.callAll('revive');
    }
}

function ballReset(){
    
    lives--;
    if(lives === 0){
        gameOverText.text = "Game Over :(";
        
        if(score > highscore){
            saveHighScore();
        }
        
        bg_music.pause();
        game_over_music.play();
        game.input.onDown.removeAll();
        game.time.events.add(Phaser.Timer.SECOND * 3, function(){
            bg_music.play();
            gameOverText.text = "";
            bricks.callAll('revive');
            score = 0;
            lives = 3;
            game.input.onDown.add(launchBall, this);
            
            if (localStorage.getItem("highscore") !== null) {
                highscore = parseInt(localStorage.getItem("highscore"));
            }
        }, this);
        
    }
    bHasLaunched = false;
    if(Math.random() > 0.5){
            ball.reset(paddle1.x, paddle1.y - 20);
        }
        else{
            ball.reset(paddle2.x, paddle2.y - 20);
    }
}

function render() {
    game.debug.soundInfo(bg_music, 20, 32);
}


function saveHighScore(){
    localStorage.setItem("highscore", highScore);
}