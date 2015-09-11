module.exports = function ClientGameEngine(gameController, gameHandler) {

    function start(container) {
        gameController.activate();
        container.appendChild(gameController.view.content);
        gameHandler.start();
    }

    return {
        start: start,
        on: gameHandler.on.bind(gameHandler),
        startGameHistoryRecording: gameHandler.startGameHistoryRecording
    };
};