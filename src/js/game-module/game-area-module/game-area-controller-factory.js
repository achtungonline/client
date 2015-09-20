var GameAreaController = require("./game-area-controller.js");
var GameAreaView = require("./game-area-view.js");

module.exports = function GameControllerFactory(gameHandler) {
    function create() {
        var gameAreaView = GameAreaView(gameHandler);
        return GameAreaController(gameAreaView, gameHandler);
    }

    return {
        create: create
    };
};