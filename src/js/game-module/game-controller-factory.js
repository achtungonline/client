var GameAreaControllerFactory = require("./game-area-module/game-area-controller-factory.js");
var GameController = require("./game-controller.js");
var GameView = require("./game-view.js");
var FpsView = require("./fps-module/fps-view.js");
var FpsHandler = require("./fps-module/fps-handler.js");
var ScoreView = require("./score-module/score-view.js");
var ScoreHandler = require("./score-module/score-handler.js");
var PauseView = require("./views/pause-view.js");
var StopView= require("./views/stop-view.js");

module.exports = function GameControllerFactory(game) {
    function create() {
        var gameAreaController = GameAreaControllerFactory(game).create();
        var fpsView = FpsView(FpsHandler(game));
        var scoreView = ScoreView(ScoreHandler(game));
        var gameView = GameView(gameAreaController.view, fpsView, PauseView(game), StopView(game), scoreView);
        return GameController(gameView, gameAreaController);
    }

    return {
        create: create
    };
};
