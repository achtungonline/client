var WormRenderer = require("./worm-renderer.js");
var forEach = require("core/src/core/util/for-each.js");

module.exports = function WormsRenderer(options) {
    var gameState = options.gameState;
    var playerConfigs = options.playerConfigs;
    var shapeRenderer = options.shapeRenderer;
    var wormHeadsContext = options.wormHeadsContext;
    var shapeModifierImmutable = options.shapeModifierImmutable;
    var drawBotTrajectories = options.drawBotTrajectories;

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
            showTrajectories: drawBotTrajectories && gameState.phase !== "startPhase"
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
