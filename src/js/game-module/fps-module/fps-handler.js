var EventEmitter = require("events").EventEmitter;

var events = {};
events.FPS_CHANGED = "fpsChanged";

module.exports = function FpsHandler(gameHandler) {
    var eventEmitter = new EventEmitter();
    var numUpdates;
    var fps;
    var intervalId;

    gameHandler.on(gameHandler.events.GAME_UPDATED, function updateFps() {
        update();
    });

    function update() {
        numUpdates++;
    }

    function start() {
        numUpdates = 0;
        fps = 0;
        intervalId = setInterval(function updateFps() {
            fps = numUpdates;
            numUpdates = 0;
            eventEmitter.emit(events.FPS_CHANGED, fps);
        }, 1000);
    }

    function stop() {
        clearInterval(intervalId);
    }

    return {
        update: update,
        start: start,
        stop: stop,
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};