var GameFactory = require("core/src/game-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var RenderFactory = require("./render/render-factory.js");

module.exports = function Engine() {
    var game = GameFactory().create();
    var circle = ShapeFactory().createCircle(30, 100, 100);


    function render(renderHandler) {
        renderHandler.renderMap(game.map);
        renderHandler.renderShape(circle, "red");

        window.requestAnimationFrame(function () {
            render(renderHandler);
        });
    }

    return {
        start: function (canvasContext) {
            var renderHandler = RenderFactory().createRenderHandler(canvasContext);

            window.requestAnimationFrame(function () {
                render(renderHandler);
            });
        }
    }
};
