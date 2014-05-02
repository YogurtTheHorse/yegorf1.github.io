//CONSTANTS
var PLAYERS_COLORS = [
		0xABCDEF,
		0xFFB085,
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
	],
	POINTS = [0, 0, 0, 0],
	playersCount = 2;

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
	this.game.load.image('chip', 'assets/circle.png')
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

	var shape = this.game.add.graphics(0, 0);
	//draw enemy
	shape.lineStyle(2, PLAYERS_COLORS[1], 1);
	shape.beginFill(PLAYERS_COLORS[1], 1);
	shape.drawRect(0, 0, convertX(1), convertY(SAVE_ZONE_SIZE));
	//draf player
	shape.lineStyle(2, PLAYERS_COLORS[0], 1);
	shape.beginFill(PLAYERS_COLORS[0], 1);
	shape.drawRect(0, convertY(1 - SAVE_ZONE_SIZE), convertX(1), convertY(SAVE_ZONE_SIZE));

	this.chips = this.game.add.group();
	this.chips.enableBody = true;

	for (var i = 0; i < 5; i++) {
		setupChip	(
			this.chips.create(convertX(i / 5 + 1 / 10), convertY(1 - SAVE_ZONE_SIZE / 2), 'chip'), 
			i, PLAYER_FIRST
		);
		setupChip	(
			this.chips.create(convertX(i / 5 + 1 / 10), convertY(SAVE_ZONE_SIZE / 2), 'chip'), 
			i, PLAYER_SECOND
		);
	}
}

function setupChip(chip, number, owner) {
	chip.scale.setTo(convertY(CHIP_SIZE) / 256);
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
	chip.events.onInputDown.add(drag);
	chip.events.onInputUp.add(stopDrag);
}

function drag(chip, pointer) {
	if (isInBounds(BOUNDS[chip.owner], chip.y) && !chip.dragging){
	    chip.body.moves = false;
	    chip.dragging = true;
	    chip.pointer = pointer;
	    chip.oldPos = { x: chip.x, y: chip.y };
	    chip.startPos = chip.oldPos;
	}
}

function stopDrag (chip, pointer) {
	if (chip.dragging) {
		if (isInBounds(BOUNDS[chip.owner], chip.y)) {
			if (chip.startPos) {
				chip.x = chip.startPos.x;
				chip.y = chip.startPos.y;
				chip.startPos = null;
			}
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
		}
	}
}

function MainGameUpdate () {
	this.game.physics.arcade.collide(this.chips);
	this.chips.forEach(function (chip) {
		if (chip.dragging && chip.pointer) {
			if (isInBounds(BOUNDS[chip.owner], chip.y)) {
	    		chip.oldPos = { x: chip.x, y: chip.y };
				chip.x = chip.pointer.worldX;
				chip.y = chip.pointer.worldY;
			} else {
				stopDrag(chip, chip.pointer);
			}
		} else if (chip.body.isRunning) {

		} else {
			chip.body.velocity.setTo(
										chip.body.velocity.x * 0.99, 
										chip.body.velocity.y * 0.99
									);

		}
	})
}



function MainGameRender () {
}