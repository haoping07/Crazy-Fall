var loadState = {
    preload: function () {
        //Display loading text
        var loadingLabel = game.add.text(game.width / 2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);

        //Display loading bar
        var progressBar = game.add.sprite(game.width / 2, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        //Load gameplay asstes
        game.load.image('ball', 'assets/ball.png');
        game.load.spritesheet('stair', 'assets/stair.png', 130.5, 20);
        game.load.spritesheet('player', 'assets/player3.png', 49, 40);
        game.load.audio('bg_music1', ['assets/bg_music1.mp3']);
        game.load.audio('bg_music2', ['assets/bg_music2.mp3']);
        game.load.audio('dead1', ['assets/dead1.wav']);
        game.load.audio('dead2', ['assets/dead2.wav']);
        game.load.audio('land', ['assets/land.wav']);
        game.load.audio('emp1', ['assets/pull.wav']);
        game.load.audio('emp2', ['assets/cui.wav']);
        game.load.audio('jump', ['assets/jump.wav']);
        game.load.image('landGFX', 'assets/pixel.png');
        game.load.image('dieGFX', 'assets/pixel2.png');
        game.load.audio('fast1', ['assets/fast1.wav']);
        game.load.audio('fast2', ['assets/fast2.wav']);
        game.load.audio('begin', ['assets/begin.wav']);

        //Load menu background
        game.load.image('background', 'assets/background.png');
    },

    create: function () {
        //Start menu state
        game.state.start('menuState');
    }
}