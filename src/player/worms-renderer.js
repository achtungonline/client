var WormRenderer = require("./worm-renderer.js");
var forEach = require("core/src/util/for-each.js");

module.exports = function WormsRenderer(game, shapeRenderer, wormBodiesContext, wormHeadsContext, shapeModifierImmutable) {
    var wormRenderers = {};

    //TODO: Need to listen to game for events that remove/add worms to update the wormRenderers map.

    game.players.forEach(function (player) {
        player.worms.forEach(function (worm) {
            wormRenderers[worm.id] = WormRenderer(worm, shapeRenderer, wormBodiesContext, wormHeadsContext, shapeModifierImmutable);
        });
    });

    function render() {
        wormHeadsContext.clearRect(0, 0, wormBodiesContext.canvas.width, wormBodiesContext.canvas.height);

        forEach(wormRenderers, function (wormRenderer) {
            wormRenderer.render();
        });
    }

    return {
        render: render
    };
};