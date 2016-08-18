var ShapeRenderer = require("./shape/shape-renderer.js");
var MapRenderer = require("./renderers/map-renderer.js");
var WormHeadRenderer = require("./renderers/worm-head-renderer.js");
var PowerUpRenderer = require("./renderers/power-up-renderer.js");
var WormBodyRenderer = require("./renderers/worm-body-renderer.js");

module.exports = function GameCanvasRenderer({ gameState, playerConfigs, scale, mapBorderWidth }) {
    scale = scale || 1;
    mapBorderWidth = mapBorderWidth || 10;

    var gameCanvasContainer = document.createElement("div");
    gameCanvasContainer.className = "ao-game-area";

    var prevRenderTime = 0;

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
    var mapCanvas =  createBorderCanvas("mapCanvas", mapBoundingBox);
    var powerUpCanvas = createCanvas("powerUpCanvas", mapBoundingBox);
    var wormBodyCanvas1 = createCanvas("wormBodyCanvas1", mapBoundingBox);
    var wormBodyCanvas2 = createCanvas("wormBodyCanvas2", mapBoundingBox);
    var wormBodyCanvas3 = createCanvas("wormBodyCanvas3", mapBoundingBox);
    var wormHeadCanvas = createCanvas("wormHeadCanvas", mapBoundingBox);
    canvasContainer.appendChild(mapCanvas);
    canvasContainer.appendChild(powerUpCanvas);
    canvasContainer.appendChild(wormBodyCanvas1);
    canvasContainer.appendChild(wormBodyCanvas2);
    canvasContainer.appendChild(wormBodyCanvas3);
    canvasContainer.appendChild(wormHeadCanvas);



    gameCanvasContainer.appendChild(canvasContainer);
    // Create and setup the renderers for the canvases
    var shapeRenderer = ShapeRenderer();
    var mapRenderer = MapRenderer({
        map: gameState.map,
        canvas: mapCanvas,
        shapeRenderer: shapeRenderer,
        borderWidth: mapBorderWidth
    });
    var powerUpRenderer = PowerUpRenderer({
        canvas: powerUpCanvas
    });
    var wormBodyRenderer = WormBodyRenderer({
        playerConfigs: playerConfigs,
        fadeCanvas: wormBodyCanvas1,
        mainCanvas: wormBodyCanvas2,
        secondaryCanvas: wormBodyCanvas3
    });

    var wormHeadRenderer = WormHeadRenderer({
        playerConfigs: playerConfigs,
        shapeRenderer: shapeRenderer,
        canvas: wormHeadCanvas,
        drawTrajectories: false
    });

    function render (renderOptions = {}) {
        var renderStartTime = prevRenderTime;
        var renderEndTime = gameState.gameTime;
        if (renderOptions.renderTime !== undefined) {
            renderEndTime = renderOptions.renderTime;
        }
        mapRenderer.render(gameState, renderStartTime, renderEndTime);
        wormHeadRenderer.render(gameState, renderStartTime, renderEndTime);
        powerUpRenderer.render(gameState, renderStartTime, renderEndTime);
        wormBodyRenderer.render(gameState, renderStartTime, renderEndTime);
        prevRenderTime = renderEndTime;
    }

    return {
        render: render,
        container: gameCanvasContainer
    };
};
