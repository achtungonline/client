module.exports = function DeltaTimeHandler(requestAnimationFrame, gameHistory) {

    function start() {
        var updateIndex = 0;
        var previousTime = Date.now();

        function deltaTimeCall(callBack) {
            if (updateIndex < gameHistory.updates.length) {
                var deltaTime = gameHistory.updates[updateIndex].deltaTime;
                updateIndex++;
                var currentTime = Date.now();
                var sleepTime = Math.max(previousTime + deltaTime * 1000 - currentTime, 0);
                previousTime = currentTime;

                setTimeout(function() {
                    requestAnimationFrame(function () {
                        callBack(deltaTime);
                    });
                }, sleepTime);
            }
        }

        return deltaTimeCall;
    }

    return {
        start: start
    };

};