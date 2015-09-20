var GameAreaControllerFactory = require("./game-area-module/game-area-controller-factory.js");
var GameController = require("./game-controller.js");
var GameView = require("./game-view.js");
var FpsView = require("./fps-module/fps-view.js");
var FpsHandler = require("./fps-module/fps-handler.js");
var PauseView = require("./pause-module/pause-view.js");

module.exports = function GameControllerFactory(gameHandler) {
    function create() {

        var gameAreaController = GameAreaControllerFactory(gameHandler).create();
        var fpsView = FpsView(FpsHandler(gameHandler));
        var gameView = GameView(gameAreaController.view, fpsView, PauseView(gameHandler));
        return GameController(gameView, gameAreaController);
    }

    return {
        create: create
    };
};