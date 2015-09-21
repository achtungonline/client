module.exports = function DeltaTimeHandler(requestAnimationFrame) {


    function start(gameState) {
        gameState.previousUpdateTime = Date.now();
    }

    function update(gameState, callBack) {
        requestAnimationFrame(function () {
            var currentTime = Date.now();
            var deltaTime = (currentTime - gameState.previousUpdateTime) / 1000;
            gameState.previousUpdateTime = currentTime;
            callBack(deltaTime);
        });
    }

    return {
        start: start,
        update: update
    };
};