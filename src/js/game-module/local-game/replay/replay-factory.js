var GameFactory = require("../game-factory.js");
var requestFrame = require("./../request-frame.js");
var DeltaTimeHandler = require("./../delta-time-handler.js");
var Replay = require("./replay.js");


module.exports = function ReplayFactory() {
    var gameFactory = GameFactory();
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);

    function create(gameHistory) {
        var game = gameFactory.create(gameHistory.numberOfPlayers, 0, gameHistory.map, gameHistory.seed);
        var replay = Replay(game, gameHistory, deltaTimeHandler);
        return replay;
    }

    return {
        create: create
    };
};
