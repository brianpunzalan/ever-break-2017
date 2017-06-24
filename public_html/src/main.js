//custom script

// WEBGL or HTML canvas? Phaser.AUTO

var HEIGHT = 800;
var WIDTH = 600;

var game = new Phaser.Game(HEIGHT, WIDTH, Phaser.AUTO, 'gameCanvas', 
    {preload: preload,
        create: create,
        update: update});


var saitama_sprite;

function preload(){
    console.log("Preloading");
    game.load.image('saitama', 'resources/saitama.png');
}

function create(){
    console.log("Creating");
    saitama_sprite = game.add.sprite(game.world.centerX,game.world.centerY,'saitama');
    saitama_sprite.anchor.set(0.5,0.5);
}

function update(){
    saitama_sprite.angle += 1;
//    saitama_sprite.scale += 1.1;
}


