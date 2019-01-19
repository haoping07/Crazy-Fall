var bootState = {
    preload: function () {
        //Load bar assets
        game.load.image('progressBar', 'assets/progressBar.png');
    },

    create: function () {
        //Set background
        game.stage.backgroundColor = '#3498db';
        game.renderer.renderSession.roundPixels = true;
        //Enable physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.state.start('loadState');
    }
};