var startPhaseType = require("core/src/round/phase/start-phase.js").type;
var playPhaseType = require("core/src/round/phase/play-phase.js").type;

var CanvasRendererFactory = require("./canvas-renderer-factory.js");

module.exports = function PlayAreaView(gameHandler) {
    var playAreaContainer = document.createElement("div");
    playAreaContainer.className = "play-area-container";

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

        return CanvasRendererFactory().createLayeredCanvasRenderer(gameState, mapCanvas, wormBodiesCanvas, wormHeadsCanvas);
    }

    var canvasRenderer = setupGameRenderer(gameHandler.gameState);

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


    function render() {
        canvasRenderer.render();
    }

    return {
        render: render,
        content: playAreaContainer
    };
};