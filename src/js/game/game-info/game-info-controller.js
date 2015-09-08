module.exports = function GameInfoController(gameInfoView, fpsController) {
    return {
        activate: function() {
            fpsController.activate();
            gameInfoView.render();
        },
        view: gameInfoView
    };
};