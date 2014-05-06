//CONSTANTS
var BACKGROUND_COLOR = '#ddd',
	PLAYERS_COLORS = [
		0x63C8E1,
		0xEB4949,
		0x75CB7F,
		0xB3A518
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
	FONT_FAMILY = 'Arial';

//Game setup
var KickItGame = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO);


var //States
	preloadState,
	mainMenuState,
	mainGameState;


KickItGame.state.add('Preload', preloadState);
KickItGame.state.add('MainMenu', mainMenuState);
KickItGame.state.add('MainGame', mainGameState);

KickItGame.state.start('Preload');