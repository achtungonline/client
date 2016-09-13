var gameStateFunctions = require("core/src/core/game-state-functions.js");
var compression = require("core/src/core/util/compression.js");
var forEach = require("core/src/core/util/for-each.js");

var requestFrame = require("../request-frame.js");

var RENDER_DELAY = 0.1;

module.exports = function RemoteGameHandler({ gameState, onGameUpdated }) {

    var localGameState = {
        active: true,
        previousUpdateTime: Date.now(),
        renderTime: -RENDER_DELAY
    };

    function start() {
        requestFrame(update);
    }

    function updateGameState(update) {
        forEach(update.wormPathSegments, function(segments, id) {
            segments.forEach(function (segment) {
                gameStateFunctions.addWormPathSegment(gameState, id, compression.decompressWormSegment(segment));
            })
        });
        update.gameEvents.forEach(event => {gameState.gameEvents.push(event)});
        update.powerUpEvents.forEach(event => {gameState.powerUpEvents.push(event)});
        update.effectEvents.forEach(event => {gameState.effectEvents.push(event)});
        gameState.gameTime = update.gameTime;
        localGameState.renderTime = update.gameTime - RENDER_DELAY;
    }

    function update() {
        if (localGameState.active) {
            var currentTime = Date.now();
            var deltaTime = (currentTime - localGameState.previousUpdateTime) / 1000;
            localGameState.renderTime += deltaTime;

            if (onGameUpdated) {
                onGameUpdated(localGameState.renderTime);
            }
            localGameState.previousUpdateTime = currentTime;

            requestFrame(update);
        }
    }

    function stop() {
        localGameState.active = false;
    }

    return {
        start,
        stop,
        updateGameState
    };
};
