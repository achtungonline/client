var PlayerSteeringListenerFactory = require("./player-steering-listener-factory.js");
var KEY_BINDINGS = require("./../default-values.js").player.KEY_BINDINGS;
var GameHistory = require("core/src/history/game-history.js");

/**
 * GameWrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @returns {{start: Function, on: (*|function(this:*)), events: *, gameState: *}}
 * @constructor
 */
module.exports = function LocalGameHandler(game, gameHistoryHandler) {

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

    function startGameHistoryRecording() {
        var gameHistory = GameHistory(game.gameState.map, game.gameState.players.length, game.seed);
        gameHistoryHandler.recordGameHistory(game, gameHistory);
        return gameHistory;
    }

    return {
        start: game.start,
        pause: game.pause,
        resume: game.resume,
        startGameHistoryRecording: startGameHistoryRecording,
        on: game.on.bind(game),
        events: game.events,
        gameState: game.gameState
    };
};
