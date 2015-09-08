module.exports = function GameController(gameView, gameHandler) {

    function activate() {
        gameHandler.on("gameUpdated", function onUpdated(deltaTime) {
            gameView.render();
        });
    }

    return {
        activate: activate,
        view: gameView
    };
};