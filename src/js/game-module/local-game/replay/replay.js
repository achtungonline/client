var PlayerSteeringListenerFactory = require("./../player-steering-listener-factory.js");
var KEY_BINDINGS = require("./../../default-values.js").player.KEY_BINDINGS;
var GameHistory = require("core/src/core/history/game-history.js");

/**
 * Game wrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @constructor
 */
module.exports = function Replay(game, gameHistory, deltaTimeHandler) {
    var localGameState = {
        paused: false,
        replayUpdateIndex: 0
    };

    game.on(game.events.GAME_OVER, function onGameOver() {
        console.log("game over");
    });

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

    function update() {
        function setPlayerSteering(update) {
            update.steering.forEach(function ApplySteering(steering, index) {
                game.setPlayerSteering(game.gameState.players[index], steering); //TODO should only update when player actually pressed key
            });
        }

        if (!localGameState.paused) {
            var replayUpdate = gameHistory.updates[localGameState.replayUpdateIndex];
            var deltaTime = replayUpdate.deltaTime;
            setPlayerSteering(replayUpdate);

            game.update(deltaTime);
            localGameState.replayUpdateIndex++;

            if (localGameState.replayUpdateIndex === gameHistory.updates.length) {
                game.stop();
            }
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
