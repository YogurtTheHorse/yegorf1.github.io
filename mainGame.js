//CONSTANTS
var PLAYERS_COLORS = [
		0xABCDEF,
		0xFFB085,
		0x75CB7F,
		0xB3A518,
	],
	SAVE_ZONE_SIZE = 0.1,
	CHIP_SIZE = SAVE_ZONE_SIZE * 0.7;
	PLAYER_FIRST = 0,
	PLAYER_SECOND = 1,
	PLAYER_THIRD = 2,
	PLAYER_FOURTH = 3,
	BOUNDS = [
		[
			convertY(1),
			convertY(1 - SAVE_ZONE_SIZE)
		],
		[
			convertY(0),
			convertY(SAVE_ZONE_SIZE)
		],
		[
			convertY(1),
			convertY(1 - SAVE_ZONE_SIZE)
		],
		[
			convertY(0),
			convertY(SAVE_ZONE_SIZE)
		]
	];
//Game variables
var points = [0, 0, 0, 0],
	texts = [null, null, null, null],
	playersCount = 4,
	frame = 0,
	turn = 0,
	somethingMoving = false;

//State
mainGameState = function (game) { };

mainGameState.prototype = {
	preload: MainGamePreload,
	create: MainGameCreate,
	update: MainGameUpdate,
	render: MainGameRender
}

function MainGamePreload () {
	this.game.stage.backgroundColor = '#ddd';
	this.game.load.image('chip', 'assets/chip.png');
}

function MainGameCreate () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Draw line in the center
	bmd = this.game.add.bitmapData(WINDOW_WIDTH, WINDOW_HEIGHT);
        
    bmd.ctx.beginPath();
    bmd.ctx.lineWidth = "2";
    bmd.ctx.strokeStyle = 'white';
    bmd.ctx.setLineDash([5, 6]);
    bmd.ctx.moveTo(0, convertY(0.5));
    bmd.ctx.lineTo(convertX(1), convertY(0.5));
    bmd.ctx.stroke();
    bmd.ctx.closePath();
    this.game.add.sprite(0, 0, bmd); 


	this.shape = this.game.add.graphics(0, 0);
	this.chips = this.game.add.group();
	this.chips.enableBody = true;

	setupFirstPlayer(this);
	setupSecondPlayer(this);
	if (playersCount > 2) {
		setupThirdPlayer(this);
		if (playersCount > 3) {
			setupFourthPlayer(this);
		}
	}
}

function setupFirstPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_FIRST], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_FIRST], 1);
	var rectLenght = convertX(1);
	if (playersCount > 2)
		rectLenght /= 2;
	state.shape.drawRect(0, convertY(1 - SAVE_ZONE_SIZE), rectLenght, convertY(SAVE_ZONE_SIZE));

	for (var i = 0; i < 5; i++) {
		var posX = convertX(i / 5 + 1 / 10);
		if (playersCount > 2) {
			posX /= 2;
		}
		setupChip(
					state.chips.create(posX, convertY(1 - SAVE_ZONE_SIZE / 2), 'chip'), 
					i, PLAYER_FIRST
				 );
	}
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	//TODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
	texts[PLAYER_FIRST] = state.game.add.text(
												3, convertY(0.5) - 10, 
												"0", 
												{
													font: "16px Arial",
													fill: "#0"
												}
											 );
	texts[PLAYER_FIRST].anchor.setTo(0.5, 0.5);
}

function setupSecondPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_SECOND], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_SECOND], 1);
	var rectLenght = convertX(1);
	if (playersCount > 2)
		rectLenght /= 2;
	state.shape.drawRect(0, 0, rectLenght, convertY(SAVE_ZONE_SIZE));

	for (var i = 0; i < 5; i++) {
		var posX = convertX(i / 5 + 1 / 10);
		if (playersCount > 2) {
			posX /= 2;
		}
		setupChip	(
			state.chips.create(posX, convertY(SAVE_ZONE_SIZE / 2), 'chip'), 
			i, PLAYER_SECOND
		);
	}
}

function setupThirdPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_THIRD], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_THIRD], 1);

	state.shape.drawRect(convertX(0.5), convertY(1 - SAVE_ZONE_SIZE), convertX(1), convertY(SAVE_ZONE_SIZE));

	for (var i = 0; i < 5; i++) {
		var posX = convertX(0.5) + convertX(i / 5 + 1 / 10) / 2;
		setupChip(
					state.chips.create(posX, convertY(1 - SAVE_ZONE_SIZE / 2), 'chip'), 
					i, PLAYER_THIRD
				 );
	}
}

function setupFourthPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_FOURTH], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_FOURTH], 1);
	state.shape.drawRect(convertX(0.5), 0, convertX(0.5), convertY(SAVE_ZONE_SIZE));

	for (var i = 0; i < 5; i++) {
		var posX = convertX(0.5) + convertX(i / 5 + 1 / 10) / 2;
		setupChip	(
			state.chips.create(posX, convertY(SAVE_ZONE_SIZE / 2), 'chip'), 
			i, PLAYER_FOURTH
		);
	}
}

function setupChip(chip, number, owner) {
	var MAX_MASS = 6;
	var mass = Math.ceil(Math.random() * (MAX_MASS - 1)) + 1;

	chip.scale.setTo(convertY(CHIP_SIZE / MAX_MASS * mass) / 64);
	chip.mass = mass * 100;
	chip.anchor.setTo(0.5, 0.5);
	chip.tint = PLAYERS_COLORS[owner];
	chip.number = number;
	chip.owner = owner;
	chip.dragging = false;
	chip.inputEnabled = true;
	chip.input.start(0, true);
	chip.body.collideWorldBounds = true;
	chip.body.allowGravity = false;
	chip.body.bounce.setTo(0.7, 0.7);
	chip.body.immovable = true;
	chip.events.onInputDown.add(drag);
	chip.events.onInputUp.add(stopDrag);
}

function drag(chip, pointer) {
	if (turn != chip.owner)
		return;

	if (isInBounds(BOUNDS[chip.owner], chip.y) && !chip.dragging){
	    chip.body.moves = false;
	    chip.dragging = true;
	    chip.pointer = pointer;
	    chip.oldPos = { x: chip.x, y: chip.y };
	    chip.startPos = chip.oldPos;
	    chip.body.immovable = false;
	}
}

function stopDrag (chip, pointer) {
	if (chip.dragging) {
		if (isInBounds(BOUNDS[chip.owner], chip.y)) {
			if (chip.startPos) {
				chip.moveTo = chip.startPos;
			}
			chip.body.moves = true;;
			chip.dragging = false;
			chip.pointer = null
			chip.oldPos = null;
		} else {
			var Xvector = (chip.x - chip.oldPos.x) * 10,
				Yvector = (chip.y - chip.oldPos.y) * 10;

			chip.body.moves = true;;
			chip.body.velocity.setTo(Xvector, Yvector);

			chip.dragging = false;
			chip.pointer = null
			chip.oldPos = null;

			turn = (turn + 1) % playersCount;
		}
	}
}

function MainGameUpdate () {
	this.game.physics.arcade.collide(this.chips);
	this.chips.forEach(function (chip) {
		if (chip.moveTo) {
			var k = 0.05,
				dist = getSqrDistance(chip.moveTo, chip);
			if (dist < 3) {
				chip.x = chip.moveTo.x;
				chip.y = chip.moveTo.y;
				chip.moveTo = null;
				chip.body.velocity.setTo(0, 0);
	    		chip.body.immovable = true;
			} else if (dist < 15) {
				k /= 10;
			} else {
				chip.body.velocity.setTo((chip.moveTo.x - chip.x) / k, (chip.moveTo.y - chip.y) / k);
			}
		} else if (chip.dragging && chip.pointer) {
			if (isInBounds(BOUNDS[chip.owner], chip.y)) {
				if (frame % 5 == 0) {
		    		chip.oldPos = { x: chip.x, y: chip.y };
				}
				chip.x = chip.pointer.worldX;
				chip.y = chip.pointer.worldY;
			} else {
				stopDrag(chip, chip.pointer);
			}
		} else if (chip.body.isRunning) {
	    	chip.body.immovable = true;
		} else {
			chip.body.velocity.setTo(
										chip.body.velocity.x * 0.9995, 
										chip.body.velocity.y * 0.9995
									);

		}
	});
	frame++;
}

function MainGameRender () {
}