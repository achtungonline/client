var PlayerSteeringListenerFactory = require("./player-steering-listener-factory.js");
var KEY_BINDINGS = require("./../default-values.js").player.KEY_BINDINGS;
var GameHistory = require("core/src/core/history/game-history.js");

/**
 * Game wrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @constructor
 */
module.exports = function LocalGameHandler(game, gameHistoryHandler, deltaTimeHandler, seed) {
    var localGameState = {
        paused: false
    };

    function setupSteeringListenerEvents(game) {
        var playerSteeringListener = PlayerSteeringListenerFactory(game).create();
        var players = game.gameState.players;
        for (var i = 0; i < players.length; i++) {
            var keyBindings = KEY_BINDINGS[i];
            var leftKey = keyBindings[0];
            var rightKey = keyBindings[1];
            playerSteeringListener.addListener(players[i], leftKey, rightKey);
        }
    }

    setupSteeringListenerEvents(game);

    game.on(game.events.GAME_OVER, function onGameOver() {
        console.log("game over");
    });

    // TODO: History stuff should not be in this "class".
    function startGameHistoryRecording() {
        var gameHistory = GameHistory(game.gameState.map, game.gameState.players.length, seed);
        gameHistoryHandler.recordGameHistory(game, gameHistory);
        return gameHistory;
    }

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
        startGameHistoryRecording: startGameHistoryRecording,
        on: game.on.bind(game),
        events: game.events,
        gameState: game.gameState
    };
};
