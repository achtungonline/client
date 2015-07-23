var EventEmitter = require("events").EventEmitter;

var EVENT_FPS_CHANGED = "fpsChanged";
var events = [EVENT_FPS_CHANGED];

module.exports = function FpsHandler() {
    var eventEmitter = new EventEmitter();
    var numUpdates;
    var fps;
    var intervalId;

    function update() {
        numUpdates++;
    };

    function start() {
        numUpdates = 0;
        fps = 0;
        intervalId = setInterval(function updateFps() {
            fps = numUpdates;
            numUpdates = 0;
            eventEmitter.emit(EVENT_FPS_CHANGED, fps);
        }, 1000);
    }

    function stop() {
        clearInterval(intervalId);
    }

    return {
        update: update,
        start: start,
        stop: stop,
        on: eventEmitter.on.bind(eventEmitter)
    };
};