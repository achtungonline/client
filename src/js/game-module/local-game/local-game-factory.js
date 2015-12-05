var requestFrame = require("./request-frame.js");
var DeltaTimeHandler = require("./delta-time-handler.js");
var LocalGame = require("./local-game.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameFactory = require("./game-factory.js");


/**
 * Creates game instances on the client using core
 * @returns {create}
 * @constructor
 */
module.exports = function LocalGameFactory() {
    var gameFactory = GameFactory();
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);

    function create(numberOfHumanPlayers, numberOfAIPlayers, map, seed) {
        if(seed === undefined) {
            seed = Math.random();
        }

        var game = gameFactory.create(numberOfHumanPlayers, numberOfAIPlayers, map, seed);
        var gameHistoryHandler = GameHistoryHandler();
        var localGame = LocalGame(game, gameHistoryHandler, deltaTimeHandler, seed);
        return localGame;
    }

    return {
        create: create
    };
};
