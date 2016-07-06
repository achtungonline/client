var playerUtils = require("core/src/core/player/player-utils.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");
var MapRenderer = require("./map-renderer.js");
var WormRenderer = require("./worm-renderer.js");
var PowerUpRenderer = require("./powerup-renderer.js");

var paper = require("paper");


module.exports = function PaperRenderer(options) {
    var gameState = options.gameState;
    var playerConfigs = options.playerConfigs;
    var canvas = options.canvas;

    // Reset style.width and style.height as paper.js overwrites them for some reason
    var scaledWidth = canvas.style.width;
    var scaledHeight = canvas.style.height;
    var paperScope = paper.setup(canvas);
    canvas.style.width = scaledWidth;
    canvas.style.height = scaledHeight;
    
    // The renderers are rendered in the order that they are created
    var mapRenderer = MapRenderer(paperScope);
    var powerUpRenderer = PowerUpRenderer(paperScope);
    var wormRenderer = WormRenderer(paperScope, playerConfigs);
    console.log(paperScope);

    function handleGameEvents(gameState) {
        gameState.gameEvents.forEach(function (gameEvent) {
            if (gameEvent.time === gameState.gameTime) { // TODO check deltaTime
                if (gameEvent.type === "clear") {
                    wormRenderer.clearWorms();
                }
            }
        });
    }

    var render = function () {
        mapRenderer.update(gameState);
        wormRenderer.update(gameState);
        powerUpRenderer.update(gameState);
        handleGameEvents(gameState);
        paperScope.view.draw();
    };

    return {
        render: render
    };
};
