var GameFactory = require("core/src/game-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var RenderFactory = require("./render/render-factory.js");
var PlayerSteeringFactory = require("./player-steering-handler-factory.js");
var requestFrame = require("./request-frame.js");

module.exports = function Engine() {
    var game = GameFactory(requestFrame).create();
    var playerSteeringHandler = PlayerSteeringFactory(game).create();
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

            playerSteeringHandler.addListener(game.players[0], 37, 39);
            playerSteeringHandler.addListener(game.players[1], 65, 83);


            game.on("updated", function onUpdated() {
                render(renderHandler);
            });

            game.start();
        }
    }
};
