mainMenuState = function (game) { };

mainMenuState.prototype = {
	preload: MainMenuPreload,
	create: MainMenuCreate,
	update: MainMenuUpdate
}

function MainMenuCreate () {
	this.game.state.start('MainGame');
}

function MainMenuPreload () {
	
}

function MainMenuUpdate () {

}