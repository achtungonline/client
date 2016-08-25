var PlayerSteeringListener = require("./player-steering-listener.js");
var requestFrame = require("./request-frame.js");

module.exports = function LocalGameHandler({ game, playerConfigs, onGameUpdated, onGameOver }) {

    var playerSteeringListener = PlayerSteeringListener(game);

    var localGameState = {
        paused: false,
        previousUpdateTime: 0
    };

    function setupSteeringListenerEvents(game, playerConfigs) {
        var players = game.gameState.players;
        for (var i = 0; i < players.length; i++) {
            var playerId = players[i].id;
            var leftKey = playerConfigs.find(pc => pc.id === playerId).left;
            var rightKey = playerConfigs.find(pc => pc.id === playerId).right;
            playerSteeringListener.addKeyListeners(playerId, leftKey, rightKey);
        }
    }

    function start() {
        setupSteeringListenerEvents(game, playerConfigs);
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
        start: start,
        pause: pause,
        resume: resume,
        stop: stop,
        isPaused: isPaused,
        gameState: game.gameState
    };
};
