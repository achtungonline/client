var startPhaseType = require("core/src/core/phase/start-phase.js").type;
var playPhaseType = require("core/src/core/phase/play-phase.js").type;

var CanvasRenderer = require("./canvas-renderer.js");

module.exports = function GameCanvasHandler(options) {
    var game = options.game;
    var playerConfigs = options.playerConfigs;
    var drawBotTrajectories = options.drawBotTrajectories;
    var scale = options.scale || 1;
    var mapBorderWidth = options.mapBorderWidth || 10;

    function createCanvas(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = name;
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        canvas.style.width = boundingBox.width * scale;
        canvas.style.height = boundingBox.height * scale;
        canvas.style.padding = mapBorderWidth * scale;
        return canvas;
    }

    function createCanvasIncludingBorder(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = name;
        canvas.width = boundingBox.width + mapBorderWidth * 2;
        canvas.height = boundingBox.height + mapBorderWidth * 2;
        canvas.style.width = (boundingBox.width + mapBorderWidth * 2) * scale;
        canvas.style.height = (boundingBox.height + mapBorderWidth * 2) * scale;
        return canvas;
    }

    function setupGameRenderer(gameState, playAreaContainer) {
        var mapBoundingBox = gameState.map.shape.boundingBox;

        var canvasContainer = document.createElement("div");
        canvasContainer.className = "canvas-container";
        canvasContainer.style.width = (mapBoundingBox.width + mapBorderWidth * 2) * scale;
        canvasContainer.style.height = (mapBoundingBox.height + mapBorderWidth * 2) * scale;

        var mapCanvas = createCanvas("map", mapBoundingBox);
        var mapBorderCanvas =  createCanvasIncludingBorder("mapBorder", mapBoundingBox);
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);
        var powerUpCanvas = createCanvas("powerUps", mapBoundingBox);
        var playAreaCanvas = createCanvas("playAreaCanvas", mapBoundingBox);

        canvasContainer.appendChild(mapBorderCanvas);
        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(powerUpCanvas);
        canvasContainer.appendChild(playAreaCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);

        playAreaContainer.appendChild(canvasContainer);

        return CanvasRenderer({
            gameState: gameState,
            playerConfigs: playerConfigs,
            mapCanvas: mapCanvas,
            mapBorderCanvas: mapBorderCanvas,
            wormHeadsCanvas: wormHeadsCanvas,
            powerUpCanvas: powerUpCanvas,
            playAreaCanvas: playAreaCanvas,
            drawBotTrajectories: drawBotTrajectories,
            mapBorderWidth: mapBorderWidth
        });
    }

    var gameCanvasContainer = document.createElement("div");
    gameCanvasContainer.className = "ao-game-area";

    var canvasRenderer = setupGameRenderer(game.gameState, gameCanvasContainer);

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
