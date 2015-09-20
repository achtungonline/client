module.exports = function ClientGameEngine(gameController, gameHandler) {

    function start(container) {
        container.appendChild(gameController.view.render());
        gameHandler.start();
    }

    return {
        start: start,
        on: gameHandler.on.bind(gameHandler),
        startGameHistoryRecording: gameHandler.startGameHistoryRecording
    };
};