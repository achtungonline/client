var GameController = require("./game-controller.js");
var GameView = require("./game-view.js");

module.exports = function GameControllerFactory(gameHandler) {
    function create() {
        var gameView = GameView(gameHandler);
        return GameController(gameView, gameHandler);
    }

    return {
        create: create
    }
};