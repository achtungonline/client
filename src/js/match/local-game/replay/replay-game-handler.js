var requestFrame = require("./../request-frame.js");

module.exports = function ReplayGameHandler({ onReplayUpdate, onReplayOver, gameState }) {

    var localGameState = {
        paused: false,
        active: true,
        replayTime: 0,
        previousUpdateTime: 0
    };

    function update() {
        var currentTime = Date.now();
        if (!localGameState.paused) {
            var deltaTime = (currentTime - localGameState.previousUpdateTime) / 1000;

            localGameState.replayTime += deltaTime;
            onReplayUpdate(localGameState.replayTime);

            if (localGameState.replayTime > gameState.gameTime) {
               stop();
            }
        }
        localGameState.previousUpdateTime = currentTime;

        if (localGameState.active) {
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
        start: start,
        stop: stop,
        setReplayProgress: setReplayProgress,
        getReplayProgress: getReplayProgress,
        pause: pause,
        resume: resume,
        isPaused: isPaused,
        isReplayOver: isReplayOver
    };
};
