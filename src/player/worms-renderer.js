var WormRenderer = require("./worm-renderer.js");
var forEach = require("core/src/util/for-each.js");

module.exports = function WormsRenderer(game, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties) {
    var wormRenderers = {};

    //TODO: Need to listen to game for events that remove/add worms to update the wormRenderers map.

    game.gameState.players.forEach(function (player) {
        player.worms.forEach(function (worm) {
            wormRenderers[worm.id] = WormRenderer(worm, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties);
        });
    });

    function render() {
        wormHeadsContext.clearRect(0, 0, wormHeadsContext.canvas.width, wormHeadsContext.canvas.height);

        forEach(wormRenderers, function (wormRenderer) {
            wormRenderer.render();
        });
    }

    return {
        render: render
    };
};