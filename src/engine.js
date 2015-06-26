var GameFactory = require("../node_modules/core/src/game-factory.js");

module.exports = function Engine() {
	var game = GameFactory().create();

	function render(canvasContext) {
		game.map.shapes.forEach(function (shape) {
			if (shape.type === "rectangle") {
				canvasContext.fillStyle = "green";
				canvasContext.fillRect(shape.x, shape.y, shape.width, shape.height);
			}
		});
	}

	return {
		start: function(canvasContext) {
			window.requestAnimationFrame(function() {
				render(canvasContext);
			});
		}
	}
};
