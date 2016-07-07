var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./renderers/map-renderer.js");
var MapBorderRenderer = require("./renderers/map-border-renderer.js");
var WormsRenderer = require("./renderers/worms-renderer.js");
var ShapeModifierImmutable = require("core/src/core/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/core/geometry/shape-factory.js");
var PowerUpRenderer = require("./renderers/power-up-renderer.js");
var WormBodyRenderer = require("./renderers/worm-body-renderer.js");

module.exports = function GameCanvasHandler(options) {
    var gameState = options.gameState;
    var playerConfigs = options.playerConfigs;
    var drawBotTrajectories = options.drawBotTrajectories;
    var scale = options.scale || 1;
    var mapBorderWidth = options.mapBorderWidth || 10;

    function createGameCanvasRenderer(gameState, playAreaContainer) {
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

        function createBorderCanvas(name, boundingBox) {
            var canvas = document.createElement("canvas");
            canvas.className = name;
            canvas.width = boundingBox.width + mapBorderWidth * 2;
            canvas.height = boundingBox.height + mapBorderWidth * 2;
            canvas.style.width = (boundingBox.width + mapBorderWidth * 2) * scale;
            canvas.style.height = (boundingBox.height + mapBorderWidth * 2) * scale;
            return canvas;
        }

        var mapBoundingBox = gameState.map.shape.boundingBox;

        // Setup the container
        var canvasContainer = document.createElement("div");
        canvasContainer.className = "canvas-container";
        canvasContainer.style.width = (mapBoundingBox.width + mapBorderWidth * 2) * scale;
        canvasContainer.style.height = (mapBoundingBox.height + mapBorderWidth * 2) * scale;

        // Create the canvas needed
        var mapCanvas = createCanvas("map", mapBoundingBox);
        var mapBorderCanvas =  createBorderCanvas("mapBorder", mapBoundingBox);
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);
        var powerUpCanvas = createCanvas("powerUps", mapBoundingBox);
        var wormBodyCanvas = createCanvas("wormBodyCanvas", mapBoundingBox);
        canvasContainer.appendChild(mapBorderCanvas);
        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(powerUpCanvas);
        canvasContainer.appendChild(wormBodyCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);
        playAreaContainer.appendChild(canvasContainer);

        // Create and setup the renderers for the canvases
        var shapeRenderer = ShapeRendererFactory().create();
        var mapRenderer = MapRenderer(gameState.map, shapeRenderer, mapCanvas.getContext("2d"), mapBorderWidth);
        var mapBorderRenderer = MapBorderRenderer(gameState.map, shapeRenderer, mapBorderCanvas.getContext("2d"), mapBorderWidth);
        var powerUpRenderer = PowerUpRenderer(gameState, powerUpCanvas.getContext("2d"), shapeRenderer);
        var wormBodyRenderer = WormBodyRenderer({playerConfigs: playerConfigs, canvas: wormBodyCanvas});
        var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());
        var wormHeadsRenderer = WormsRenderer({
            gameState: gameState,
            playerConfigs: playerConfigs,
            shapeRenderer: shapeRenderer,
            wormHeadsContext: wormHeadsCanvas.getContext("2d"),
            shapeModifierImmutable: shapeModifierImmutable,
            drawBotTrajectories: drawBotTrajectories
        });

        var prevUpdateTime = 0;

        return function render () {
            mapRenderer.render();
            mapBorderRenderer.render();
            wormHeadsRenderer.render();
            powerUpRenderer.render();
            wormBodyRenderer.render(gameState, prevUpdateTime);
            prevUpdateTime = gameState.gameTime;
        };
    }

    var gameCanvasContainer = document.createElement("div");
    gameCanvasContainer.className = "ao-game-area";

    return {
        render: createGameCanvasRenderer(gameState, gameCanvasContainer),
        container: gameCanvasContainer
    };
};
