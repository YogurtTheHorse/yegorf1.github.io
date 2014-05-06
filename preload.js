preloadState = function (game) { };

preloadState.prototype = {
	preload: PreloadPreload,
	create: PreloadCreate,
	update: PreloadUpdate
}

function PreloadCreate () {
	this.game.stage.backgroundColor = BACKGROUND_COLOR;
	this.game.state.start('MainGame');
}

function PreloadPreload () {
	
}

function PreloadUpdate () {

}