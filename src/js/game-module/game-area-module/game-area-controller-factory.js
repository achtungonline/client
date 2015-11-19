var GameAreaController = require("./game-area-controller.js");
var GameAreaView = require("./game-area-view.js");

module.exports = function GameControllerFactory(game) {
    function create() {
        var gameAreaView = GameAreaView(game);
        return GameAreaController(gameAreaView, game);
    }

    return {
        create: create
    };
};
