var playState = {

    create: function () {
        /*GFX*/
        //Change background color every 3.5 seconds
        game.stage.backgroundColor = "#4488AA";
        game.time.events.loop(3500, this.changeColor, this);

        //Create particles effect for normal stair when landing
        this.emitter = game.add.emitter(0, 0, 200);
        this.emitter.makeParticles('landGFX');
        this.emitter.setYSpeed(-800, 800);
        this.emitter.setXSpeed(-800, 800);
        this.emitter.setScale(0.5, 0, 0.5, 0, 1000);
        this.emitter.gravity = 0;

        //Create particles effect for fake stair when landing
        this.emitter1 = game.add.emitter(0, 0, 200);
        this.emitter1.makeParticles('landGFX');
        this.emitter1.setYSpeed(-800, 800);
        this.emitter1.setXSpeed(-800, 800);
        this.emitter1.setScale(2, 0, 2, 0, 1000);
        this.emitter1.gravity = 0;

        //Create particles effect for sprite death
        this.emitter2 = game.add.emitter(0, 0, 100);
        this.emitter2.makeParticles('dieGFX');
        this.emitter2.setYSpeed(-800, 800);
        this.emitter2.setXSpeed(-800, 800);
        this.emitter2.setScale(2, 0, 2, 0, 1000);
        this.emitter2.gravity = 0;

        /*Player*/
        //Add sprite
        this.player = game.add.sprite(game.width / 2, 0, 'player');
        this.player.anchor.setTo(0.5, 0.5);

        //Set sprite animations
        this.player.animations.add('rightwalk', [0, 1], 28, true);
        this.player.animations.add('leftwalk', [0, 1], 28, true);

        //Set sprite physics
        game.physics.arcade.enable(this.player);
        this.player.enableBody = true;
        this.player.body.gravity.y = 2000;
        this.player.body.immovable = false;

        //Set sprite bounce reactions
        //    this.player.body.bounce.x = 1;      // Set perfect bounce to bar.
        //    this.player.body.bounce.y = 1; 

        //Set sprite collision
        this.player.body.collideWorldBounds = true;
        game.physics.arcade.checkCollision.down = false;

        //Create stair group
        this.stairs = game.add.group();
        this.stairs.enableBody = true;

        //Create first stair for player in the beginning.
        this.stair = game.add.sprite((game.width / 2) - 65, 580, 'stair', 0, this.stairs);
        this.stair.body.velocity.y = -300;
        this.stair.body.immovable = true;
        this.stair.touched = false;

        //Create multiple stairs object in group 
        this.stairs.createMultiple(50, 'stair');
        //Set animation to all elements in group 
        this.stairs.callAll('animations.add', 'animations', 'trapNormal', [0, 1], 28, true);

        //Add the following stairs
        game.time.events.loop(400, this.addStair, this);

        /*Sounds*/
        // Background music
        this.BGM1 = game.add.audio('bg_music1');
        this.BGM2 = game.add.audio('bg_music2');

        //Sprite death sound
        this.dead1 = game.add.audio('dead1');
        this.dead2 = game.add.audio('dead2');

        //Sprite landing sound
        this.land = game.add.audio('land');

        //Sprite landing on fake stair sound
        this.emp1 = game.add.audio('emp1');
        this.emp2 = game.add.audio('emp2');

        //Sprite landing on fast stair sound
        this.fast1 = game.add.audio('fast1');
        this.fast2 = game.add.audio('fast2');

        //Sprite landing on bouncing stair sound
        this.jump = game.add.audio('jump');

        //Game start sound
        this.begin = game.add.audio('begin');
        this.begin.play();

        //Random pick game background music
        if (game.rnd.pick([-1, 1]) == 1)
            this.BGM1.loopFull();
        else
            this.BGM2.loopFull();

        /*Score Label*/
        //Initialize score
        this.score = 0;
        this.scoreLabel = game.add.text(10, 550, 'Score: 0', { font: '25px Arial', fill: '#ffffff' });

        //Enable keyboard event
        this.cursor = game.input.keyboard.createCursorKeys();
    },

    update: function () {

        //Check collision status
        game.physics.arcade.collide(this.player, this.stairs, this.hitBlock, null, this);

        //Sprite is controllable only if not dead
        if (this.player.death != 1) {
            this.moveBar();
            if (!this.player.inWorld)
                this.playerFall();
        }
    },

    //Collision function
    hitBlock: function (player, stair) {

        //Only play landing sound once when touching stairs
        if (stair.touched != true && stair.spring != true) {
            //Play fake landing sound when "trap_kill" == 1
            if (stair.trap_kill != 1) {
                //Play fast landing sound when "stair.fast" == 1
                if (stair.fast != 1) {
                    this.land.play();               
                    //Get 10 points when landing on normal stair
                    this.score += 10;
                    this.scoreLabel.text = "Score: " + this.score;
                }
                else {
                    //Get 100 point when landing on fast stair
                    this.score += 100;
                    this.scoreLabel.text = "Score: " + this.score;
                    //Random pick fast landing sound
                    if (game.rnd.pick([-1, 1]) == 1)
                        this.fast1.play();
                    else
                        this.fast2.play();
                }
            }
            else {
                //Get 50 points when landing on fake stair
                this.score += 50;
                this.scoreLabel.text = "Score: " + this.score;
                // Random pick fake landing sfx
                if (game.rnd.pick([-1, 1]) == 1)
                    this.emp1.play();
                else
                    this.emp2.play();
            }

            //The flag of landing state
            stair.touched = true;

            //Start emitter when landing on normal stari
            this.emitter.x = stair.x;
            this.emitter.y = stair.y;
            this.emitter.start(true, 500, null, 5);
        }

        //Check the type of landing stair (fake stairs)
        if (stair.trap_kill == 1) {
            //Deactivate the fake stair when touching
            stair.kill();
            stair.trap_kill = 0;
            //Start emitter when landing on fake stair
            this.emitter1.x = stair.x;
            this.emitter1.y = stair.y;
            this.emitter1.start(true, 500, null, 5);
        }

        if (stair.spring == true) {
            this.jump.play();
            this.player.body.velocity.y = -750;
            game.add.tween(stair.scale).to({ y: -2 }, 100).to({ y: 1 }, 100).start();
            this.score += 10;
            this.scoreLabel.text = "Score: " + this.score;
        }
    },

    //Sprite death scene
    playerFall: function () {
        this.player.death = 1;
        this.BGM1.stop();
        this.BGM2.stop();

        //Random pick sprite death sound
        if (game.rnd.pick([-1, 1]) == 1)
            this.dead1.play();
        else
            this.dead2.play();

        //Deactivate the sprite
        this.player.kill();

        //Start emitter for sprite death
        this.emitter2.x = this.player.x;
        this.emitter2.y = this.player.y;
        this.emitter2.start(true, 4000, null, 15);

        //Show death state
        var textStyle = { font: "32px Arial", fill: "#FF0000"/*, align: "center"/, backgroundColor: "#ffff00"*/ };
        this.finalState = game.add.text(400, 420, '            Your Score: ' + this.score + '\n\n\n\n\n   [SPACE]  RESTART\n   [ENTER]  UPLOAD SCORE' +'\n     [ESC]     BACK TO MENU', textStyle);
        this.finalState.anchor.set(0.5);

        //Death state event
        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        var replayKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        replayKey.onDown.add(this.restart, this);
        escKey.onDown.add(this.back, this);
        enterKey.onDown.add(this.scoreRecord, this);
    },

    //Move sprite
    moveBar: function () {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -600;
            this.player.animations.play('leftwalk');
            this.player.scale.x = -1;
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 600;
            this.player.animations.play('rightwalk');
            this.player.scale.x = 1;

        }
        else {
            this.player.body.velocity.x = 0;
            this.player.frame = 1;
        }
    },

    //Add the following stairs
    addStair: function () {
        //Get and reset the first dead stair
        var newStair = this.stairs.getFirstDead();
        newStair.reset(game.rnd.integerInRange(0, 500), game.height);
        newStair.trap_kill = 0;
        newStair.spring = 0;
        newStair.frame = 0;
        newStair.fast = 0;
        newStair.animations.stop(true, true);

        //Random add special stairs
        var rndNum = game.rnd.integerInRange(0, 100);
        if (rndNum > 90) {
            newStair.body.velocity.y = -700;
            newStair.fast = 1;
        }
        else if (rndNum > 20 && rndNum <= 90) {
            newStair.body.velocity.y = -250;
        }
        else if (rndNum > 10 && rndNum <= 20) {
            newStair.body.velocity.y = -150;
            //     newStair.animations.play('trapNormal');
            newStair.spring = true;
            newStair.frame = 1;
        }
        else {
            newStair.body.velocity.y = -100;
            newStair.animations.play('trapNormal');
            newStair.trap_kill = 1;
        }

        newStair.checkWorldBounds = true;
        newStair.outOfBoundsKill = true;
        newStair.body.immovable = true;
        newStair.touched = false;

        if (!newStair) { return; }
    },

    restart: function () {
        game.state.start('playState');
    },

    back: function () {
        game.state.start('menuState');
    },

    changeColor: function () {
        game.stage.backgroundColor = Phaser.Color.getRandomColor(50, 255, 255);
    },

    //Store user score in Google firebase
    scoreRecord: function () {
        var name = prompt("Please enter your name", "name");
        firebase.database().ref('scores/').push({
            name: name,
            score: this.score
        });
        var snapData = firebase.database().ref('scores/').orderByChild('score').limitToLast(6);
        var recordName = [];
        var recordScore = [];
        snapData.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                recordName.push(childSnapshot.val().name);
                recordScore.push(childSnapshot.val().score);
            });
        }).then(function () {
            game.add.text(20, 20,'Your Score has been uploaded!', { font: '30px Arial', fill: '#ffffff', backgroundColor: '	#220088' });
        });
    }
};