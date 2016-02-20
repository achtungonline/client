module.exports = function DeltaTimeHandler(requestAnimationFrame) {

    function start(state) {
        state.previousUpdateTime = Date.now();
    }

    function update(state, callBack) {
        requestAnimationFrame(function () {
            var currentTime = Date.now();
            var deltaTime = (currentTime - state.previousUpdateTime) / 1000;
            state.previousUpdateTime = currentTime;
            callBack(deltaTime);
        });
    }

    return {
        start: start,
        update: update
    };
};
