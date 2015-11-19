var LocalGameFactory = require("../local-game-factory.js");
var requestFrame = require("./../request-frame.js");
var ReplayDeltaTimeHandler = require("./replay-delta-time-handler.js");


module.exports = function ReplayFactory() {

    function create(gameHistory) {
        var map = gameHistory.map;

        var deltaTimeHandler = ReplayDeltaTimeHandler(requestFrame, gameHistory);

        var game = LocalGameFactory({ deltaTimeHandler: deltaTimeHandler }).create(gameHistory.numberOfPlayers, 0, map, gameHistory.seed);
        deltaTimeHandler.gameState = game.gameState; //TODO: NO NO NO!!
        return game;
    }

    return {
        create: create
    };
};
