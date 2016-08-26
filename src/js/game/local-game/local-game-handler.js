var PlayerSteeringListener = require("./player-steering-listener.js");
var requestFrame = require("./request-frame.js");

module.exports = function LocalGameHandler({ game, players, onGameUpdated, onGameOver }) {

    var playerSteeringListener = PlayerSteeringListener(game);

    var localGameState = {
        paused: false,
        previousUpdateTime: 0
    };

    function setupSteeringListenerEvents() {
        players.forEach(function (player) {
            if (player.type === "human") {
                playerSteeringListener.addKeyListeners(player.id, player.left, player.right);
            }
        });
    }

    function start() {
        setupSteeringListenerEvents();
        localGameState.previousUpdateTime = Date.now();
        game.start();
        requestFrame(update);
    }

    function update() {
        var currentTime = Date.now();
        if (game.isActive() && !localGameState.paused) {
            var deltaTime = (currentTime - localGameState.previousUpdateTime) / 1000;
            game.update(deltaTime);
            if (onGameUpdated) {
                onGameUpdated(deltaTime);
            }
        }
        localGameState.previousUpdateTime = currentTime;

        if (game.isActive()) {
            requestFrame(update);
        } else {
            playerSteeringListener.removeKeyListeners();
            if (onGameOver) {
                onGameOver();
            }
        }
    }

    function pause() {
        localGameState.paused = true;
    }

    function resume() {
        localGameState.paused = false;
        localGameState.previousUpdateTime = Date.now();
    }

    function isPaused() {
        return localGameState.paused;
    }

    function stop() {
        game.stop();
    }

    return {
        start,
        pause,
        resume,
        stop,
        isActive: game.isActive,
        isPaused,
        gameState: game.gameState
    };
};
