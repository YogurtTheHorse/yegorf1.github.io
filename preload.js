preloadState = function (game) { };

preloadState.prototype = {
	preload: PreloadPreload,
	create: PreloadCreate,
	update: PreloadUpdate
}

function PreloadCreate () {
	this.game.state.start('MainMenu');
}

function PreloadPreload () {
	
}

function PreloadUpdate () {

}