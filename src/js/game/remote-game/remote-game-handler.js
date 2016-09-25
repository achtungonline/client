var RENDER_DELAY = 0.1;

module.exports = function RemoteGameHandler({ gameState }) {

    var localGameState = {
        startTime: undefined
    };

    function start() {
        localGameState.startTime = Date.now();
    }

    function getRenderTime() {
        return (Date.now() - localGameState.startTime) / 1000 - RENDER_DELAY;
    }

    return {
        getRenderTime,
        start
    };
};
