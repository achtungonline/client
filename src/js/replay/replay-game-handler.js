var requestFrame = require("../game/request-frame.js");

module.exports = function ReplayGameHandler({ onReplayOver, gameState }) {

    var localGameState = {
        paused: false,
        active: true,
        replayTime: 0,
        previousUpdateTime: 0
    };

    function update() {
        if (localGameState.active) {
            var currentTime = Date.now();
            if (!localGameState.paused) {
                var deltaTime = (currentTime - localGameState.previousUpdateTime) / 1000;

                localGameState.replayTime += deltaTime;

                if (localGameState.replayTime > gameState.gameTime) {
                    stop();
                }
            }
            localGameState.previousUpdateTime = currentTime;

            requestFrame(update);
        }
    }


    function start() {
        localGameState.previousUpdateTime = Date.now();
        requestFrame(update);
    }

    function stop() {
        localGameState.active = false;
        onReplayOver();
    }

    function getReplayTime() {
        return localGameState.replayTime;
    }

    function setReplayProgress(progress) {
        localGameState.replayTime = progress * gameState.gameTime;
    }

    function getReplayProgress() {
        return Math.min(localGameState.replayTime / gameState.gameTime, 1);
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

    function isReplayOver() {
        return !localGameState.active;
    }

    return {
        gameState,
        getReplayTime,
        start,
        stop,
        setReplayProgress,
        getReplayProgress,
        pause,
        resume,
        isPaused,
        isReplayOver
    };
};
