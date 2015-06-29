var GameFactory = require("../node_modules/core/src/game-factory.js");
var CoordinateShapeFactory = require("../node_modules/core/src/shapes/coordinate-shape-factory.js");

module.exports = function Engine() {
	var game = GameFactory().create();
	var coordCircle = CoordinateShapeFactory().createCircle(15, 100, 100);

	function renderCircle(canvasContext, shape) {
		if (shape.type === "circle") {
			canvasContext.beginPath();
			canvasContext.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
			canvasContext.fillStyle = 'red';
			canvasContext.fill();
			//canvasContext.lineWidth = 5;
			//canvasContext.strokeStyle = '#003300';
			//canvasContext.stroke();
		}
	}

	function render(canvasContext) {
		game.map.shapes.forEach(function (shape) {
			if (shape.type === "rectangle") {
				canvasContext.fillStyle = "black";
				canvasContext.fillRect(shape.x, shape.y, shape.width, shape.height);
			}
		});
		renderCircle(canvasContext, coordCircle);
	}

	return {
		start: function(canvasContext) {
			window.requestAnimationFrame(function() {
				render(canvasContext);
			});
		}
	}
};
