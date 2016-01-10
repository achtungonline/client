var WormRenderer = require("./worm-renderer.js");
var forEach = require("core/src/core/util/for-each.js");

module.exports = function WormsRenderer(gameState, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties) {
    var wormRenderers = {};
    var clearWholeCanvas = false;

    function render() {
        gameState.worms.forEach(function (worm) {
            if (!wormRenderers[worm.id]) {
                wormRenderers[worm.id] = WormRenderer(worm, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties);
            }
        });

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
