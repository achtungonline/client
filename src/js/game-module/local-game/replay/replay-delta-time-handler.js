module.exports = function ReplayDeltaTimeHandler(requestAnimationFrame, gameHistory) {
    function start(state) {
        state.previousUpdateTime = Date.now();
    }

    function update(state, callBack) {
        var gameState = this.gameState; // NO NO!!!

        if (gameState.replayUpdateIndex < gameHistory.updates.length) {

            var deltaTime = gameHistory.updates[gameState.replayUpdateIndex].deltaTime;
            var currentTime = Date.now();
            var sleepTime = Math.max(state.previousUpdateTime + deltaTime * 1000 - currentTime, 0);
            if(!gameState.gamePaused) {
                state.previousUpdateTime = currentTime;
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
