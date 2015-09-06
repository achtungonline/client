var startPhaseType = require("core/src/round/phase/start-phase.js").type;
var playPhaseType = require("core/src/round/phase/play-phase.js").type;

var GameRendererFactory = require("./../game-renderer-factory.js");

/**
 * Takes care of appending the play area of the game.
 * @param playAreaContainer
 * @param gameHandler
 * @constructor
 */
module.exports = function PlayAreaContainerHandler(playAreaContainer, gameHandler) {
    function createCanvas(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = name;
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        return canvas;
    }

    function setupGameRenderer(gameState) {
        var mapBoundingBox = gameState.map.shape.boundingBox;

        var canvasContainer = document.createElement("div");
        canvasContainer.className = "canvas-container";
        canvasContainer.style.width = mapBoundingBox.width;
        canvasContainer.style.height = mapBoundingBox.height;

        var mapCanvas = createCanvas("map", mapBoundingBox);
        var wormBodiesCanvas = createCanvas("wormBodies", mapBoundingBox);
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);

        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(wormBodiesCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);

        playAreaContainer.appendChild(canvasContainer);

        return GameRendererFactory().createLayeredCanvasRenderer(gameHandler.gameState, mapCanvas, wormBodiesCanvas, wormHeadsCanvas);
    }

    var gameRenderer = setupGameRenderer(gameHandler.gameState);

    gameHandler.on("gameUpdated", function onUpdated(deltaTime) {
        gameRenderer.render();
    });

    gameHandler.on("newPhaseStarted", function onNewPhaseStarted(phaseType) {
        // TODO We need a more convenient way to handle render properties for different rounds
        console.log("New phase started: " + phaseType);
        if (phaseType === startPhaseType) {
            gameRenderer.setRenderProperty("drawArrows", true);
            gameRenderer.setRenderProperty("showTrajectories", false);
        } else if (phaseType === playPhaseType) {
            gameRenderer.setRenderProperty("drawArrows", false);
            gameRenderer.setRenderProperty("showTrajectories", true);
        } else {
            gameRenderer.setRenderProperty("showTrajectories", false);
            gameRenderer.setRenderProperty("drawArrows", false);
        }
    });
};
