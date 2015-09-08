
module.exports = function GameController(gameView, playAreaController, gameInfoController) {
    return {
        activate: function() {
            gameInfoController.activate();
            playAreaController.activate();
            gameView.render();

        },
        view: gameView
    };
};