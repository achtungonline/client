var GameInfoControllerFactory = require("./game-info/game-info-controller-factory.js");
var GameControllerFactory = require("./game/game-controller-factory.js");
var GameController = require("./game-container-controller.js");
var GameContainerView = require("./game-container-view.js");

module.exports = function GameContainerControllerFactory(gameHandler) {
    function create() {

        var gameInfoController = GameInfoControllerFactory(gameHandler).create();
        var gameController = GameControllerFactory(gameHandler).create();
        var gameView = GameContainerView(gameController.view, gameInfoController.view);
        return GameController(gameView, gameController, gameInfoController);
    }

    return {
        create: create
    };
};