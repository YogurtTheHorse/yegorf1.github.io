var WINDOW_WIDTH =  window.innerWidth || document.documentElement.clientWidth ||
                    document.getElementsByTagName('body')[0].clientWidth,
    WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight || 
                    document.getElementsByTagName('body')[0].clientHeight;

function convertX(x) {
	return WINDOW_WIDTH * x;
}

function convertY(y) {
	return WINDOW_HEIGHT * y;
}

function isInBounds(bounds, pos) {
	var leftBound = Math.min(bounds[0], bounds[1]),
		rightBound = Math.max(bounds[0], bounds[1]);
	return 	pos >= leftBound &&
			pos <= rightBound;
}

function hexToRGB(hex) {
	return {
		r: (hex >> 16) & 255,
    	g: (hex >> 8) & 255,
    	b: hex & 255
    }
}

function getSqrDistance(a, b) {
	function sqr (x) {
		return x * x;
	}
	return sqr(a.x - b.x) + sqr(a.y - b.y);
}

function drawRect(graph, x, y, w, h, clr) {
	graph.lineStyle(2, clr, 1);
	graph.beginFill(clr, 1);

	graph.drawRect(x, y, w, h);
}

function sign (a) {
	if (a < 0)
		return -1;
	else if (a > 0)
		return 1;
	else
		return 0;
}