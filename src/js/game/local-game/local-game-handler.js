var requestFrame = require("../request-frame.js");

module.exports = function LocalGameHandler({ game, onGameOver }) {

    var localGameState = {
        paused: false,
        previousUpdateTime: 0
    };

    function start() {
        localGameState.previousUpdateTime = Date.now();
        game.start();
        requestFrame(update);
    }

    function update() {
        if (game.isActive()) {
            var currentTime = Date.now();
            if (!localGameState.paused) {
                var deltaTime = (currentTime - localGameState.previousUpdateTime) / 1000;
                game.update(deltaTime);
            }
            localGameState.previousUpdateTime = currentTime;

            if (game.isActive()) {
                requestFrame(update);
            } else {
                if (onGameOver) {
                    onGameOver();
                }
            }
        }
    }

    function pause() {
        localGameState.paused = true;
    }

    function resume() {
        localGameState.paused = false;
        localGameState.previousUpdateTime = Date.now();
    }

    function isPaused() {
        return localGameState.paused;
    }

    function stop() {
        game.stop();
    }

    return {
        start,
        pause,
        resume,
        stop,
        isActive: game.isActive,
        isPaused,
        gameState: game.gameState
    };
};
