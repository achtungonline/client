var EventEmitter = require("events").EventEmitter;

var events = {};
events.SCORE_CHANGED = "scoreChanged";

// TEMPORARY FILE FOR TESTING

module.exports = function FpsHandler(gameHandler) {
    var eventEmitter = new EventEmitter();
    var numUpdates = 100;
    var scores = [
        {name: "Erik", score: 0},
        {name: "Lucas", score: 0},
        {name: "Mathias", score: 0}
    ];

    gameHandler.on(gameHandler.events.GAME_UPDATED, function updateFps() {
        numUpdates++;
        if (numUpdates > 100) {
            numUpdates = 0;
            scores[Math.floor(Math.random()*3)].score++;
            scores.sort(function (a, b) {
                var scoreDiff = b.score - a.score;
                if (scoreDiff < 0) return -1;
                if (scoreDiff > 0) return 1;
                return a.name.localeCompare(b.name);
            });
            eventEmitter.emit(events.SCORE_CHANGED, scores);
        }
    });

    return {
        on: eventEmitter.on.bind(eventEmitter),
        events: events
    };
};