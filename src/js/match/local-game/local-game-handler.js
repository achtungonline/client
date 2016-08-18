var PlayerSteeringListener = require("./player-steering-listener.js");
var requestFrame = require("./request-frame.js");


module.exports = function LocalGameHandler({ game, playerConfigs }) {

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
        if (!localGameState.paused) {
            var deltaTime = (currentTime - localGameState.previousUpdateTime) / 1000;

            game.update(deltaTime);
        }
        localGameState.previousUpdateTime = currentTime;

        if (game.isActive()) {
            requestFrame(update);
        }
    }

    function pause() {
        localGameState.paused = true;
    }

    function resume() {
        localGameState.paused = false;
    }

    function isPaused() {
        return localGameState.paused;
    }

    function stop() {
        game.stop();
    }

    game.on(game.events.GAME_OVER, function() {
        playerSteeringListener.removeKeyListeners();
    });

    return {
        start: start,
        pause: pause,
        resume: resume,
        stop: stop,
        isPaused: isPaused,
        isGameOver: game.isGameOver,
        on: game.on.bind(game),
        off: game.off.bind(game),
        events: game.events,
        gameState: game.gameState
    };
};
