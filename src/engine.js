var GameFactory = require("core/src/game-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var RenderFactory = require("./render/render-factory.js");
var requestFrame = require("./request-frame.js");

module.exports = function Engine() {
    var game = GameFactory(requestFrame).create();
    var circle = ShapeFactory().createCircle(30, 100, 100);

    function render(renderHandler) {
        renderHandler.renderMap(game.map);

        game.players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                worm.body.forEach(function (shape) {
                    renderHandler.renderShape(shape, "red");
                });

                renderHandler.renderShape(worm.head, "yellow");
            });
        });
    }

    return {
        start: function (canvasContext) {
            var renderHandler = RenderFactory().createRenderHandler(canvasContext);
            
            game.on("updated", function onUpdated() {
                render(renderHandler);
            });

            game.start();
        }
    }
};
