var PlayerSteeringListener = require("./player-steering-listener.js");
var DeltaTimeHandler = require("./delta-time-handler.js");
var requestFrame = require("./request-frame.js");


/**
 * Game wrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * NOTE: If the game is never stopped (paused forever or for some other reason), the playerSteeringListener can cause memory leaks.
 * @constructor
 */

//TODO: has shared functions with replay-game-handler
module.exports = function LocalGameHandler(options) {
    var game = options.game;
    var playerConfigs = options.playerConfigs;
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);

    var playerSteeringListener = PlayerSteeringListener(game);

    var localGameState = {
        paused: false
    };

    function requestNextUpdate() {
        deltaTimeHandler.update(localGameState, function onUpdateTick(deltaTime) {
            update(deltaTime);
        });
    }

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
        game.start();
        deltaTimeHandler.start(localGameState);
        requestNextUpdate();
    }

    function update(deltaTime) {
        if (!localGameState.paused) {
            game.update(deltaTime);
        }

        if (game.isActive()) {
            requestNextUpdate();
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
