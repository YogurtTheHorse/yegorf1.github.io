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
var chips,
	game,
	points = [0, 0, 0, 0],
	chipsCount = [5, 5, 5, 5],
	texts = [null, null, null, null],
	playersCount = 4,
	frame = 0,
	turn = 0,
	somethingMoving = false,
	chipsCollisionGroup;

//State
mainGameState = function (game) { };

mainGameState.prototype = {
	preload: MainGamePreload,
	create: MainGameCreate,
	update: MainGameUpdate,
	render: MainGameRender
}

function MainGamePreload () {
	game = this.game;
	game.stage.backgroundColor = '#ddd';
	game.load.image('chip', 'assets/chip.png');
}

function MainGameCreate () {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.restitution = 0.8;

	//Draw line in the center
	bmd = game.add.bitmapData(WINDOW_WIDTH, WINDOW_HEIGHT);

	bmd.ctx.beginPath();
	bmd.ctx.lineWidth = "2";
	bmd.ctx.strokeStyle = 'white';
	bmd.ctx.setLineDash([5, 6]);
	bmd.ctx.moveTo(0, convertY(0.5));
	bmd.ctx.lineTo(convertX(1), convertY(0.5));
	bmd.ctx.stroke();
	bmd.ctx.closePath();
	game.add.sprite(0, 0, bmd); 
	this.shape = game.add.graphics(0, 0);

	chipsCollisionGroup = game.physics.p2.createCollisionGroup();
	chips = game.add.group();
	chips.enableBody = true;
	chips.physicsBodyType = Phaser.Physics.P2JS;

	setupFirstPlayer(this);
	setupSecondPlayer(this);
	if (playersCount > 2) {
		setupThirdPlayer(this);
		if (playersCount > 3) {
			setupFourthPlayer(this);
		}
	}
	chips.setAll('static', true);
}

function setupFirstPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_FIRST], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_FIRST], 1);
	var rectLenght = convertX(1);
	if (playersCount > 2)
		rectLenght /= 2;
	state.shape.drawRect(0, convertY(1 - SAVE_ZONE_SIZE), rectLenght, convertY(SAVE_ZONE_SIZE));

	var chip = chips.create(convertX(0.5), convertY(0.5), 'chip');
	setupChip(chip, PLAYER_FIRST, game);
	chip.moveTo =  	{
						x: rectLenght / 2,
						y: convertY(1 - SAVE_ZONE_SIZE / 2)
					};
}

function setupSecondPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_SECOND], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_SECOND], 1);
	var rectLenght = convertX(1);
	if (playersCount > 3)
		rectLenght /= 2;
	state.shape.drawRect(0, 0, rectLenght, convertY(SAVE_ZONE_SIZE));
}

function setupThirdPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_THIRD], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_THIRD], 1);
	state.shape.drawRect(convertX(0.5), convertY(1 - SAVE_ZONE_SIZE), convertX(1), convertY(SAVE_ZONE_SIZE));
}

function setupFourthPlayer(state) {
	state.shape.lineStyle(2, PLAYERS_COLORS[PLAYER_FOURTH], 1);
	state.shape.beginFill(PLAYERS_COLORS[PLAYER_FOURTH], 1);
	state.shape.drawRect(convertX(0.5), 0, convertX(0.5), convertY(SAVE_ZONE_SIZE));
}

function setupChip(chip, owner, game) {
	if (chipsCount[owner] < 1)
		return false;
	chipsCount[owner]--;

	var MAX_MASS = 6;
	var mass = Math.ceil(Math.random() * (MAX_MASS - 1)) + 1;

	chip.scale.setTo(convertY(CHIP_SIZE / MAX_MASS * mass) / 64);
	chip.mass = mass * 100;
	chip.anchor.setTo(0.5, 0.5);
	chip.tint = PLAYERS_COLORS[owner];
	chip.owner = owner;
	chip.dragging = false;
	chip.body.collides(chipsCollisionGroup);
	chip.body.setCircle(chip.width / 2);
	chip.inputEnabled = true;
	chip.input.start(0, true);
	chip.events.onInputDown.add(drag);
	chip.events.onInputUp.add(stopDrag);

	return true;
}

function drag(chip, pointer) {
	if (turn != chip.owner || chip.moveTo)
		return;

	if (isInBounds(BOUNDS[chip.owner], chip.y) && !chip.dragging){
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
				chip.moveTo = chip.startPos;
			}
			chip.dragging = false;
			chip.pointer = null
			chip.oldPos = null;
		} else {
			var Xvector = (chip.x - chip.oldPos.x) * 10,
				Yvector = (chip.y - chip.oldPos.y) * 10;

			chip.body.velocity.x = Xvector;
			chip.body.velocity.y = Yvector;

			chip.dragging = false;
			chip.pointer = null
			chip.oldPos = null;

			if (!nextTurn()) {
				alert('game over');
			}
		}
	}
}

function nextTurn () {
	var i = 1;
	while (!chipsCount[(turn + i) % playersCount]) {
		i++;
		if (i >= 5)
			return false;
	}

	turn = (turn + i) % playersCount;

	var realChipY = SAVE_ZONE_SIZE / 2,
		chipX = 0.5;

	if (turn == PLAYER_FIRST || turn == PLAYER_THIRD) {
		realChipY = 1 - realChipY;
	}

	if (playersCount > 3) {
		chipX /= 2;
		if (turn > PLAYER_SECOND) {
			chipX += 0.5;
		}
	}

	realChipY = convertY(realChipY);
	chipX = convertX(chipX);

	var chipY = -realChipY;

	if (turn == PLAYER_FIRST || turn == PLAYER_THIRD) {
		chipY = WINDOW_HEIGHT - chipY;
	}

	var chip = chips.create(chipX, chipY, 'chip');
	setupChip(chip, turn, game);
	chip.moveTo =  	{
						x: chipX,
						y: realChipY
					};

	return true;
}

function MainGameUpdate () {
	chips.forEach(function (chip) {
		if (chip.moveTo) {
			var k = 0.2,
				dist = getSqrDistance(chip.moveTo, chip);
			if (dist < 3) {
				chip.x = chip.moveTo.x;
				chip.y = chip.moveTo.y;
				chip.moveTo = null;
				chip.body.velocity.x = 0;
				chip.body.velocity.y = 0;
			} else if (dist < 15) {
				k /= 10;
			} else {
				chip.body.velocity.x = (chip.moveTo.x - chip.x) / k
				chip.body.velocity.y = (chip.moveTo.y - chip.y) / k;
			}
		} else if (chip.dragging && chip.pointer) {
			if (isInBounds(BOUNDS[chip.owner], chip.y)) {
				if (frame % 5 == 0) {
					chip.oldPos = { x: chip.x, y: chip.y };
				}
				chip.body.velocity.x = 10 * (chip.pointer.worldX - chip.x);
				chip.body.velocity.y = 10 * (chip.pointer.worldY - chip.y);
			} else {
				stopDrag(chip, chip.pointer);
			}
		} else {
			/*chip.body.velocity.x = chip.body.velocity.x * 0.9995;
			chip.body.velocity.y = chip.body.velocity.y * 0.9995;*/
		}
	});
	frame++;
}

function MainGameRender () {
}