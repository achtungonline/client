var LocalGameHandler = require("./local-game/local-game-handler.js");
var LocalGameFactory = require("./local-game/local-game-factory.js");
var GameContainerHandler = require("./game-container-handler.js");
var FpsHandler = require("./game-info/fps-handler.js");

var NUMBER_HUMAN_PLAYERS = 1;
var NUMBER_AI_PLAYERS = 9;

/**
 * The engine that makes the game come alive. Handles both the game and output of elements on the gameContainer
 * @returns {{start: Function}}
 * @constructor
 */
module.exports = function ClientGameEngine(gameContainer) {

    var game = LocalGameFactory().create(NUMBER_HUMAN_PLAYERS, NUMBER_AI_PLAYERS);
    var gameHandler = LocalGameHandler(game);
    var fpsHandler = FpsHandler(gameHandler);


    var gameContainerHandler = GameContainerHandler(gameContainer, gameHandler, fpsHandler);

    return {
        start: function () {
            gameHandler.start();
            fpsHandler.start();
        }
    };
};
