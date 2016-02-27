var WormRenderer = require("./worm-renderer.js");
var forEach = require("core/src/core/util/for-each.js");

module.exports = function WormsRenderer(gameState, playerConfigs, shapeRenderer, wormHeadsContext, shapeModifierImmutable) {
    var wormRenderers = {};
    var clearWholeCanvas = false;

    function render() {
        gameState.worms.forEach(function (worm) {
            if (!wormRenderers[worm.id]) {
                wormRenderers[worm.id] = WormRenderer(worm, playerConfigs, shapeRenderer, wormHeadsContext, shapeModifierImmutable);
            }
        });

        if (clearWholeCanvas) {
            wormHeadsContext.clearRect(0, 0, wormHeadsContext.canvas.width, wormHeadsContext.canvas.height);
        } else {
            forEach(wormRenderers, function (wormRenderer) {
                wormRenderer.clearHead();
            });
        }
        var renderProperties = {
            drawArrows: gameState.phase === "startPhase",
            showTrajectories: gameState.phase !== "startPhase"
        };

        clearWholeCanvas = renderProperties.drawArrows || renderProperties.showTrajectories;

        forEach(wormRenderers, function (wormRenderer) {
            wormRenderer.render(renderProperties);
        });
    }

    return {
        render: render
    };
};
