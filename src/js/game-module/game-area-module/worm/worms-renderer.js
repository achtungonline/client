var WormRenderer = require("./worm-renderer.js");
var forEach = require("core/src/util/for-each.js");

module.exports = function WormsRenderer(gameState, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties) {
    var wormRenderers = {};
    var clearWholeCanvas = false;

    //TODO: Need to listen to game for events that remove/add worms to update the wormRenderers map.

    gameState.players.forEach(function (player) {
        player.worms.forEach(function (worm) {
            wormRenderers[worm.id] = WormRenderer(worm, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties);
        });
    });

    function render() {
        if (clearWholeCanvas) {
            wormHeadsContext.clearRect(0, 0, wormHeadsContext.canvas.width, wormHeadsContext.canvas.height);
        } else {
            forEach(wormRenderers, function (wormRenderer) {
                wormRenderer.clearHead();
            });
        }
        clearWholeCanvas = renderProperties.drawArrows || renderProperties.showTrajectories;

        forEach(wormRenderers, function (wormRenderer) {
            wormRenderer.render();
        });
    }

    return {
        render: render
    };
};