var menuState = {
    create: function () {
        game.add.image(0, 0, 'background');

        //Display game title
        var nameLabel = game.add.text(game.width / 2, 80, 'C r a z y  F a l l', { font: '100px Arial', fill: '#ffffff', align: "center" });
        nameLabel.anchor.setTo(0.5, 0.5);
        var rankList = game.add.text(game.width / 2 - 150, 150, '## World Top6 ##', { font: '40px Arial', fill: '#ffffff', align: "center" });

        //Show player's ranking
        var snapData = firebase.database().ref('scores/').orderByChild('score').limitToLast(6);
        var recordName = [];
        var recordScore = [];
        
        //Retrieve rank list from Google firebase
        snapData.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                recordName.push(childSnapshot.val().name);
                recordScore.push(childSnapshot.val().score);
            });
        }).then(function () {
            var rank = 1;
            var rankY = 200;
            for (var i = recordScore.length - 1; i >= 0; i--) {
                game.add.text(game.width / 2 - 150, rankY, 'Rank ' + rank + ' - ' + recordName[i] + ' - ' + recordScore[i], { font: '30px Arial', fill: '#ffffff', backgroundColor: '#000000', align: "center" });
                rank++;
                rankY += 50;
            }
            this.loadFinish = 1;
        });

        //Game Start instruction
        var startLabel = game.add.text(game.width / 2-10, game.height - 60, 'press the space key to play', { font: '40px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.start, this);
    },

    start: function () {
        if(loadFinish == 1)
        game.state.start('playState');
    },
}