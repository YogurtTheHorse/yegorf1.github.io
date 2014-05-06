//Game variables
var chips,
	game,
	points = [0, 0, 0, 0],
	chipsCount = [5, 5, 5, 5],
	texts = [null, null, null, null],
	playersCount = 0,
	frame = 0,
	turn = 0,
	somethingMoving = false,
	chipsCollisionGroup;

//Menu variables
var game, field, twoPlayersButton, fourPlayersButton, isInMenu, textTwo, textFour, slideMe;

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
	game.stage.backgroundColor = BACKGROUND_COLOR;
	game.load.image('chip', 'assets/chip.png');
}

function MainGameCreate () {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.restitution = 0.8;

	chipsCollisionGroup = game.physics.p2.createCollisionGroup();
	setupMenu();
}

function setupChips() {
	chips = game.add.group();
	chips.enableBody = true;
	chips.physicsBodyType = Phaser.Physics.P2JS;

	chips.setAll('static', true);
}

function setupMenu() {
	isInMenu = true;
	field = game.add.graphics(0, 0);
	//Setup field
	drawRect(field, 0, convertY(1 - SAVE_ZONE_SIZE), 
			 convertX(0.5), convertY(SAVE_ZONE_SIZE), 
			 PLAYERS_COLORS[PLAYER_FIRST]);
	drawRect(field, 0, 0, convertX(1),
			 convertY(SAVE_ZONE_SIZE), 
			 PLAYERS_COLORS[PLAYER_SECOND]);
	drawRect(field, convertX(0.5),
			 convertY(1 - SAVE_ZONE_SIZE),
			 convertX(0.5), convertY(SAVE_ZONE_SIZE), 
			 PLAYERS_COLORS[PLAYER_THIRD]);

	//Draw dotted line at center
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

	setupChips();

	//Setup buttons
	var rgb = hexToRGB(PLAYERS_COLORS[PLAYER_FIRST]);
	//two players button
	var twoPlayersBitmap = game.add.bitmapData(convertX(1), convertY(0.5) + 1);
	twoPlayersBitmap.context.fillStyle = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)';

	twoPlayersButton = game.add.sprite(0, 0, twoPlayersBitmap);
	twoPlayersBitmap.context.fillRect(0, 0, convertX(1), convertY(0.5) + 1);
	twoPlayersBitmap.context.dirty = true;
	setupButton(twoPlayersButton, false);

	//four players button
	rgb = hexToRGB(PLAYERS_COLORS[PLAYER_SECOND]);
	var fourPlayersBitmap = game.add.bitmapData(convertX(1), convertY(0.5));
	fourPlayersBitmap.context.fillStyle = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)';

	fourPlayersButton = game.add.sprite(0, convertY(0.5), fourPlayersBitmap);
	fourPlayersBitmap.context.fillRect(0, 0, convertX(1), convertY(0.5));
	fourPlayersBitmap.context.dirty = true;
	setupButton(fourPlayersButton, true);

	//Add labels
	var style = {
					font: '24px '+ FONT_FAMILY,
					fill: BACKGROUND_COLOR,
					align: 'center'
				};
	var slideStyle = {
					font: '24px '+ FONT_FAMILY,
					fill: "#737373",
					align: 'center'
				};
    textTwo =  game.add.text(convertX(0.5), convertY(0.25), "2 players game", style);
    textTwo.anchor.setTo(0.5, 0.5);
    slideMe =  game.add.text(convertX(0.5), convertY(0.5), "Slide to start", slideStyle);
    slideMe.anchor.setTo(0.5, 0.8);
    textFour = game.add.text(convertX(0.5), convertY(0.75), "4 players game", style)
    textFour.anchor.setTo(0.5, 0.5);
}

function setupButton (button, isTwo) {
	button.inputEnabled = true;
	button.input.start(0, true);

	button.events.onInputDown.add(function(btn, pnt) { drag(btn, pnt, isTwo); });
	button.events.onInputUp.add(function(btn, pnt) { stopDrag(btn, pnt, isTwo); });

	button.dragging = false;
	button.started = false;
	button.moveTo = 0;
	button.velocity = 0;
}

function drag(button, pointer, isFourPlayerButton) {
	if (!button.dragging) {
		button.startXPosition = button.x;
		button.oldXPosition = button.x;
		button.dragging = true;
		button.pointer = pointer;
		button.offset = button.x - button.pointer.worldX;
	}
}

function stopDrag(button, pointer, isFourPlayerButton) {
	if (button.dragging) {
		button.oldXPosition = null;
		button.dragging = false;
		if (Math.abs(button.x) > convertX(0.3)) {
			button.velocity = 600 * sign(-button.x);
			button.started = true;
			playersCount = isFourPlayerButton ? 4 : 2;
			if (isFourPlayerButton) {
				drawRect(field, convertX(0.5), 0,
						 convertX(0.5), convertY(SAVE_ZONE_SIZE), 
						 PLAYERS_COLORS[PLAYER_FOURTH]);
			} else {
				drawRect(field, convertX(0.5),
						 convertY(1 - SAVE_ZONE_SIZE),
						 convertX(0.5), convertY(SAVE_ZONE_SIZE), 
						 PLAYERS_COLORS[PLAYER_FIRST]);
			}
			setupFirstPlayer(this);
			setupSecondPlayer(this);
			if (playersCount > 2) {
				setupThirdPlayer(this);
				if (playersCount > 3) {
					setupFourthPlayer(this);
				}
			}
		} else {
			button.moveTo = 0.0000001;
		}
	}
}

function setupFirstPlayer(state) {
	var rectLenght = convertX(1);
	if (playersCount > 2)
		rectLenght /= 2;

	var chip = chips.create(convertX(0.5), convertY(0.5), 'chip');
	setupChip(chip, PLAYER_FIRST, game);
	chip.moveTo =  	{
						x: rectLenght / 2,
						y: convertY(1 - SAVE_ZONE_SIZE / 2)
					};
}

function setupSecondPlayer(state) {
}

function setupThirdPlayer(state) {
}

function setupFourthPlayer(state) {
}

function setupChip(chip, owner, game) {
	if (chipsCount[owner] < 1)
		return false;
	chipsCount[owner]--;

	var MAX_MASS = 6;
	var mass = Math.ceil(Math.random() * (MAX_MASS - 1)) + 1;

	chip.scale.setTo(convertY(CHIP_SIZE / MAX_MASS * mass) / 64);
	chip.mass = mass * 10000;
	chip.anchor.setTo(0.5, 0.5);
	chip.tint = PLAYERS_COLORS[owner];
	chip.owner = owner;
	chip.dragging = false;
	chip.body.collides(chipsCollisionGroup);
	chip.body.setCircle(chip.width / 2);
	chip.inputEnabled = true;
	chip.input.start(0, true);
	chip.events.onInputDown.add(dragChip);
	chip.events.onInputUp.add(stopDragChip);

	return true;
}

function dragChip(chip, pointer) {
	if (turn != chip.owner || chip.moveTo)
		return;

	if (isInBounds(BOUNDS[chip.owner], chip.y) && !chip.dragging){
		chip.dragging = true;
		chip.pointer = pointer;
		chip.oldPos = { x: chip.x, y: chip.y };
		chip.startPos = chip.oldPos;
	}
}

function stopDragChip (chip, pointer) {
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
		if (i >= 1 + playersCount)
			return false;
	}

	turn = (turn + i) % playersCount;

	var realChipY = SAVE_ZONE_SIZE / 2,
		chipX = 0.5;

	if (turn == PLAYER_FIRST || turn == PLAYER_THIRD) {
		realChipY = 1 - realChipY;
	}

	if (playersCount > 2) {
		if (!(turn == PLAYER_SECOND && playersCount < 4)) {
			chipX /= 2;
		}

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
	if (isInMenu) {
		updateButton(twoPlayersButton, true);
		updateButton(fourPlayersButton, false);
	} else {
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
					stopDragChip(chip, chip.pointer);
				}
			} else {
				//chip.body.velocity.x = chip.body.velocity.x * 1;
				//chip.body.velocity.y++;
			}
		});
		frame++;
	}
}

function updateButton (button, isFourPlayerButton) {
	if (button.dragging) {
		button.velocity = button.x - (button.pointer.worldX + button.offset);
		slideMe.alpha = 1 - Math.min(1, Math.abs(-button.x) / convertX(0.3));
	} else if (button.moveTo) {
		slideMe.alpha = 1 - Math.min(1, Math.abs(-button.x) / convertX(0.3));
		var dist = Math.abs(button.x - button.moveTo);
		if (dist < 6) {
			button.moveTo = 0;
			button.x = 0;
			button.velocity = 0;
		}
		button.velocity = (button.x - button.moveTo) / 4;
	}
	if (Math.abs(button.velocity) > 1) {
		button.x -= button.velocity / 2;
		button.velocity *= 0.9;
	} else {
		button.velocity = 0;
	}
	if (button.started) {
		if (!twoPlayersButton.started) {
			twoPlayersButton.started = true;
			twoPlayersButton.velocity = -button.velocity;
		}
		if (!fourPlayersButton.started) {
			fourPlayersButton.started = true;
			fourPlayersButton.velocity = -button.velocity;
		}
		if (Math.abs(twoPlayersButton.x) > convertX(1) && Math.abs(fourPlayersButton.x) > convertX(1)) {
			isInMenu = false;
			textTwo.destroy();
			textFour.destroy();
		}
	}
}

function MainGameRender () {
}