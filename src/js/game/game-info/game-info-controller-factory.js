var FpsView = require("./fps/fps-view.js");
var FpsHandler = require("./fps/fps-handler.js");
var FpsController = require("./fps/fps-controller.js");
var GameInfoView = require("./game-info-view.js");
var GameInfoController = require("./game-info-controller.js");

module.exports = function GameInfoControllerFactory(gameHandler) {
    function create() {
        var fpsView = FpsView();
        var fpsHandler = FpsHandler(gameHandler);
        var fpsController = FpsController(fpsView, fpsHandler);
        var gameInfoView = GameInfoView(fpsView);
        return GameInfoController(gameInfoView, fpsController);
    }

    return {
        create: create
    };
};