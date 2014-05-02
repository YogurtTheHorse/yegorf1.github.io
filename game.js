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