//Create canvas
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas');

//Add state
game.state.add('bootState', bootState);
game.state.add('loadState', loadState);
game.state.add('menuState', menuState);
game.state.add('playState', playState);

// start the boot state
game.state.start('bootState');