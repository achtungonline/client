var PlayerSteeringListener = require("./player-steering-listener.js");
var DeltaTimeHandler = require("./delta-time-handler.js");
var requestFrame = require("./request-frame.js");


/**
 * Game wrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @constructor
 */

//TODO: has shared functions with replay-game-handler
module.exports = function LocalGameHandler(options) {
    var game = options.game;
    var playerConfigs = options.playerConfigs;
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);

    var localGameState = {
        paused: false
    };

    function setupSteeringListenerEvents(game, playerConfigs) {
        var playerSteeringListener = PlayerSteeringListener(game);
        var players = game.gameState.players;
        for (var i = 0; i < players.length; i++) {
            var playerId = players[i].id;
            var leftKey = playerConfigs.find(pc => pc.id === playerId).left;
            var rightKey = playerConfigs.find(pc => pc.id === playerId).right;
            playerSteeringListener.addListener(playerId, leftKey, rightKey);
        }
    }

    setupSteeringListenerEvents(game, playerConfigs);


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
