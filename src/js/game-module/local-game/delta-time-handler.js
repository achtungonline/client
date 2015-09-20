module.exports = function DeltaTimeHandler(requestAnimationFrame) {

    function start() {
        var previousTime = Date.now();

        function deltaTimeCall(callBack) {
            requestAnimationFrame(function () {
                var currentTime = Date.now();
                var deltaTime = (currentTime - previousTime) / 1000;
                previousTime = currentTime;
                callBack(deltaTime);
            });
        }

        return deltaTimeCall;
    }

    return {
        start: start
    };

};