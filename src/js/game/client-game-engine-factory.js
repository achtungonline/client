var LocalGameHandler = require("./local-game/local-game-handler.js");
var LocalGameFactory = require("./local-game/local-game-factory.js");
var ClientGameEngine = require("./client-game-engine.js");
var GameContainerControllerFactory = require("./game-container-controller-factory.js");

var NUMBER_HUMAN_PLAYERS = 1;
var NUMBER_AI_PLAYERS = 9;

module.exports = function ClientGameEngineFactory() {
    function create() {
        var game = LocalGameFactory().create(NUMBER_HUMAN_PLAYERS, NUMBER_AI_PLAYERS);
        var gameHandler = LocalGameHandler(game);
        var gameController = GameContainerControllerFactory(gameHandler).create();
        return ClientGameEngine(gameController, gameHandler);
    }

    return {
        create: create
    };
};
