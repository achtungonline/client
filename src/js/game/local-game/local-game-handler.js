var PlayerSteeringListenerFactory = require("./../player/player-steering-listener-factory.js");
var KEY_BINDINGS = require("./../default-values.js").player.KEY_BINDINGS;
/**
 * GameWrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @returns {{start: Function, on: (*|function(this:*)), events: *, gameState: *}}
 * @constructor
 */
module.exports = function LocalGameHandler(game) {

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

    game.on("gameOver", function onGameOver() {
        console.log("game over");
    });

    return {
        start: function () {
            game.start();
        },
        on: game.on.bind(game),
        events: game.events,
        gameState: game.gameState
    };
};
