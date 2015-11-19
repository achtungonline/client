var startPhaseType = require("core/src/core/round/phase/start-phase.js").type;
var playPhaseType = require("core/src/core/round/phase/play-phase.js").type;

var CanvasRendererFactory = require("./canvas-renderer-factory.js");

module.exports = function GameAreaView(gameHandler) {
    gameHandler.on("newPhaseStarted", function onNewPhaseStarted(phaseType) {
        // TODO We need a more convenient way to handle render properties for different rounds
        console.log("New phase started: " + phaseType);
        if (phaseType === startPhaseType) {
            canvasRenderer.setRenderProperty("drawArrows", true);
            canvasRenderer.setRenderProperty("showTrajectories", false);
        } else if (phaseType === playPhaseType) {
            canvasRenderer.setRenderProperty("drawArrows", false);
            canvasRenderer.setRenderProperty("showTrajectories", true);
        } else {
            canvasRenderer.setRenderProperty("showTrajectories", false);
            canvasRenderer.setRenderProperty("drawArrows", false);
        }
    });

    gameHandler.on(gameHandler.events.GAME_UPDATED, function onUpdated(deltaTime) {
        canvasRenderer.render();
    });


    var playAreaContainer = document.createElement("div");
    playAreaContainer.className = "ao-game-area";

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
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);
        var powerUpCanvas = createCanvas("powerUps", mapBoundingBox);
        var playAreaCanvas = createCanvas("wormBodies", mapBoundingBox);

        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(powerUpCanvas);
        canvasContainer.appendChild(playAreaCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);

        playAreaContainer.appendChild(canvasContainer);

        return CanvasRendererFactory().createLayeredCanvasRenderer(gameState, mapCanvas, wormHeadsCanvas, powerUpCanvas, playAreaCanvas);
    }

    var canvasRenderer = setupGameRenderer(gameHandler.gameState);


    function render() {
        return playAreaContainer;
    }

    return {
        render: render
    };
};
