var GameFactory = require("../node_modules/core/src/game-factory.js");
var ShapeFactory = require("../node_modules/core/src/geometry/shape-factory.js");
var RenderFactory = require("./render/render-factory.js");

module.exports = function Engine() {
    var game = GameFactory().create();
    var circle = ShapeFactory().createCircle(30, 100, 100);


    function render(canvasContext) {
        var renderHandler = RenderFactory().createRenderHandler(canvasContext);
        renderHandler.renderMap(game.map);
        renderHandler.renderShape(circle, "red");
    }

    return {
        start: function (canvasContext) {
            window.requestAnimationFrame(function () {
                render(canvasContext);
            });
        }
    }
};
