module.exports = function ReplayDeltaTimeHandler(requestAnimationFrame, gameHistory) {
    function start(gameState) {
        gameState.previousUpdateTime = Date.now();
    }

    function update(gameState, callBack) {
        if (gameState.replayUpdateIndex < gameHistory.updates.length) {

            var deltaTime = gameHistory.updates[gameState.replayUpdateIndex].deltaTime;
            var currentTime = Date.now();
            var sleepTime = Math.max(gameState.previousUpdateTime + deltaTime * 1000 - currentTime, 0);
            if(!gameState.gamePaused) {
                gameState.previousUpdateTime = currentTime;
            }

            setTimeout(function() {
                requestAnimationFrame(function () {
                    callBack(deltaTime);
                });
            }, sleepTime);
        }
    }

    return {
        start: start,
        update: update
    };
};