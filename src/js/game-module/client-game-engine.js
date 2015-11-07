module.exports = function ClientGameEngine(gameController, gameHandler) {

    function start(container) {
        container.appendChild(gameController.view.render());
        gameHandler.start();
    }

    function pause() {
        gameHandler.pause();
    }

    function resume() {
        gameHandler.resume();
    }

    return {
        start: start,
        pause: pause,
        resume: resume,
        on: gameHandler.on.bind(gameHandler),
        startGameHistoryRecording: gameHandler.startGameHistoryRecording
    };
};
