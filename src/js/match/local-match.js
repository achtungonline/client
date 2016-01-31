var PlayerSteeringListenerFactory = require("./../game-module/local-game/player-steering-listener-factory.js");
var KEY_BINDINGS = require("./../game-module/default-values.js").player.KEY_BINDINGS;
var GameHistory = require("core/src/core/history/game-history.js");

/**
 * Match wrapper responsible of handling the match on the client. Other can listen for events and get the current state.
 * @constructor
 */
module.exports = function LocalMatch(match, gameHistoryHandler, deltaTimeHandler, seed) {
    var localMatchState = {
        paused: false
    };

    function setupSteeringListenerEvents(match) {
        var playerSteeringListener = PlayerSteeringListenerFactory(match).create();
        var players = match.matchConfig.playerConfigs;
        for (var i = 0; i < players.length; i++) {
            var keyBindings = KEY_BINDINGS[i];
            var leftKey = keyBindings[0];
            var rightKey = keyBindings[1];
            playerSteeringListener.addListener(players[i].id, leftKey, rightKey);
        }
    }

    setupSteeringListenerEvents(match);

    match.on(match.events.GAME_OVER, function onGameOver() {
        console.log("game over");
    });

    //// TODO: History stuff should not be in this "class".
    //function startGameHistoryRecording() {
    //    var gameHistory = GameHistory(game.gameState.map, game.gameState.players.length, seed);
    //    gameHistoryHandler.recordGameHistory(game, gameHistory);
    //    return gameHistory;
    //}

    function requestNextUpdate() {
        deltaTimeHandler.update(localMatchState, function onUpdateTick(deltaTime) {
            update(deltaTime);
        });
    }

    function startNextGame() {
        match.startNextGame();
        deltaTimeHandler.start(localMatchState);
        requestNextUpdate();
    }

    function update(deltaTime) {
        if (!localMatchState.paused) {
            match.update(deltaTime);
        }

        if (match.isActive()) {
            requestNextUpdate();
        }
    }

    function pause() {
        localMatchState.paused = true;
    }

    function resume() {
        localMatchState.paused = false;
    }

    function isPaused() {
        return localMatchState.paused;
    }

    return {
        startNextGame: startNextGame,
        pause: pause,
        resume: resume,
        end: match.end,
        isPaused: isPaused,
        //startGameHistoryRecording: startGameHistoryRecording,
        on: match.on.bind(match),
        events: match.events,
        getCurrentGameState: match.getCurrentGameState
    };
};
