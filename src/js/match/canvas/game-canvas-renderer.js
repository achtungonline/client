var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var BorderRenderer = require("./border/border-renderer.js");
var ShapeModifierImmutable = require("core/src/core/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/core/geometry/shape-factory.js");
var PaperRenderer = require("./paper/paper-renderer.js");

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
        var borderCanvas =  createBorderCanvas("mapBorder", mapBoundingBox);
        var paperCanvas = createCanvas("paperCanvas", mapBoundingBox);
        canvasContainer.appendChild(borderCanvas);
        canvasContainer.appendChild(paperCanvas);
        playAreaContainer.appendChild(canvasContainer);

        var paperRenderer = PaperRenderer({gameState: gameState, playerConfigs: playerConfigs, canvas: paperCanvas});

        // Create and setup the renderers for the canvases
        var shapeRenderer = ShapeRendererFactory().create();
        var borderRenderer = BorderRenderer(gameState.map, shapeRenderer, borderCanvas.getContext("2d"), mapBorderWidth);

        return function render () {
            borderRenderer.render();
            paperRenderer.render();
        };
    }

    var gameCanvasContainer = document.createElement("div");
    gameCanvasContainer.className = "ao-game-area";

    return {
        render: createGameCanvasRenderer(gameState, gameCanvasContainer),
        container: gameCanvasContainer
    };
};
