var LocalGameHandler = require("./local-game/local-game-handler.js");
var LocalGameFactory = require("./local-game/local-game-factory.js");
var ReplayFactory = require("./replay/replay-factory.js");
var ClientGameEngine = require("./client-game-engine.js");
var GameContainerControllerFactory = require("./game-container-controller-factory.js");
var GameHistoryHandler = require("core/src/history/game-history-handler.js");

var NUMBER_HUMAN_PLAYERS = 1;
var NUMBER_AI_PLAYERS = 9;

module.exports = function ClientGameEngineFactory() {
    var gameHistoryHandler = GameHistoryHandler();

    function createGame(seed) {
        var game = LocalGameFactory().create(NUMBER_HUMAN_PLAYERS, NUMBER_AI_PLAYERS, undefined, seed);

        var gameHandler = LocalGameHandler(game, gameHistoryHandler);
        var gameController = GameContainerControllerFactory(gameHandler).create();
        return ClientGameEngine(gameController, gameHandler);
    }

    function createReplay(gameHistory) {
        var game = ReplayFactory().create(gameHistory);
        gameHistoryHandler.replayGameHistory(game, gameHistory);

        var gameHandler = LocalGameHandler(game, gameHistoryHandler);
        var gameController = GameContainerControllerFactory(gameHandler).create();
        return ClientGameEngine(gameController, gameHandler);
    }

    return {
        createGame: createGame,
        createReplay: createReplay
    };
};
