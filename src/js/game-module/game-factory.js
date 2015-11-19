var LocalGameFactory = require("./local-game/local-game-factory.js");
var ReplayFactory = require("./local-game/replay/replay-factory.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");

var NUMBER_HUMAN_PLAYERS = 1;
var NUMBER_AI_PLAYERS = 9;

module.exports = function GameFactory() {

    function createGame(seed) {
        var game = LocalGameFactory().create(NUMBER_HUMAN_PLAYERS, NUMBER_AI_PLAYERS, undefined, seed);
        return game;
    }

    function createReplay(gameHistory) {
        var game = ReplayFactory().create(gameHistory);

        return game;
    }

    return {
        createGame: createGame,
        createReplay: createReplay
    };
};
