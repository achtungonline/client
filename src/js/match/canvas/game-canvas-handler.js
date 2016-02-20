var startPhaseType = require("core/src/core/phase/start-phase.js").type;
var playPhaseType = require("core/src/core/phase/play-phase.js").type;

var CanvasRenderer = require("./canvas-renderer.js");

module.exports = function GameCanvasHandler(options) {
    var game = options.game;
    var playerConfigs = options.playerConfigs;

    function createCanvas(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = name;
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        return canvas;
    }

    function setupGameRenderer(gameState, playAreaContainer) {
        var mapBoundingBox = gameState.map.shape.boundingBox;

        var canvasContainer = document.createElement("div");
        canvasContainer.className = "canvas-container";
        canvasContainer.style.width = mapBoundingBox.width;
        canvasContainer.style.height = mapBoundingBox.height;

        var mapCanvas = createCanvas("map", mapBoundingBox);
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);
        var powerUpCanvas = createCanvas("powerUps", mapBoundingBox);
        var playAreaCanvas = createCanvas("playAreaCanvas", mapBoundingBox);

        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(powerUpCanvas);
        canvasContainer.appendChild(playAreaCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);

        playAreaContainer.appendChild(canvasContainer);

        return CanvasRenderer({
            gameState: gameState,
            playerConfigs: playerConfigs,
            mapCanvas: mapCanvas,
            wormHeadsCanvas: wormHeadsCanvas,
            powerUpCanvas: powerUpCanvas,
            playAreaCanvas: playAreaCanvas});
    }

    var gameCanvasContainer = document.createElement("div");
    gameCanvasContainer.className = "ao-game-area";

    var canvasRenderer = setupGameRenderer(game.gameState, gameCanvasContainer);

    game.on("newPhaseStarted", function onNewPhaseStarted(phaseType) {
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

    game.on(game.events.GAME_UPDATED, function onUpdated(deltaTime) {
        canvasRenderer.render();
    });

    function getGameCanvasContainer() {
        return gameCanvasContainer;
    }

    return {
        getGameCanvasContainer: getGameCanvasContainer
    };
};