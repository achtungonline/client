var PlayerSteeringListener = require("./player-steering-listener.js");
var KEY_BINDINGS = require("./../../game-module/default-values.js").player.KEY_BINDINGS;
var DeltaTimeHandler = require("./delta-time-handler.js");
var requestFrame = require("./request-frame.js");


/**
 * Game wrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @constructor
 */

//TODO: has shared functions with replay-game-handler
module.exports = function LocalGameHandler(options) {
    var game = options.game;
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);

    var localGameState = {
        paused: false
    };

    function setupSteeringListenerEvents(game) {
        var playerSteeringListener = PlayerSteeringListener(game);
        var players = game.gameState.players;
        for (var i = 0; i < players.length; i++) {
            var keyBindings = KEY_BINDINGS[i];
            var leftKey = keyBindings[0];
            var rightKey = keyBindings[1];
            playerSteeringListener.addListener(players[i], leftKey, rightKey);
        }
    }

    setupSteeringListenerEvents(game);


    function requestNextUpdate() {
        deltaTimeHandler.update(localGameState, function onUpdateTick(deltaTime) {
            update(deltaTime);
        });
    }

    function start() {
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

    return {
        start: start,
        pause: pause,
        resume: resume,
        stop: game.stop,
        isPaused: isPaused,
        on: game.on.bind(game),
        events: game.events,
        gameState: game.gameState
    };
};
