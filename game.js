//Game setup
var KickItGame = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO);

var playersCount = 1; //can be between 1 and 4

var //States
	preloadState,
	mainMenuState,
	mainGameState;


KickItGame.state.add('Preload', preloadState);
KickItGame.state.add('MainMenu', mainMenuState);
KickItGame.state.add('MainGame', mainGameState);

KickItGame.state.start('Preload');