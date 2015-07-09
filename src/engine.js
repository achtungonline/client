var GameFactory = require("../node_modules/core/src/game-factory.js");
var ShapeFactory = require("../node_modules/core/src/geometry/shape-factory.js");
var renderer = require("./renderer/renderer.js");

module.exports = function Engine() {
    var game = GameFactory().create();
    var circle = ShapeFactory().createCircle(15, 100, 100, 0, 0);

    function render(canvasContext) {
        game.map.shapes.forEach(function (shape) {
            renderer.renderShape(canvasContext, shape, "black");
        });
        renderer.renderShape(canvasContext, circle, "red");
    }

    return {
        start: function (canvasContext) {
            window.requestAnimationFrame(function () {
                render(canvasContext);
            });
        }
    }
};
