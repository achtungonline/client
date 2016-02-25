var requestFrame = require("./../request-frame.js");
var DeltaTimeHandler = require("./../delta-time-handler.js");
var GameFactory = require("core/src/game-factory.js");

/**
 * Game wrapper responsible of handling the game on the client. Other can listen on the LocalGameHandler for events and get the current state.
 * @constructor
 */

//TODO: has shared functions with local-game-handler
module.exports = function Replay(gameHistory) {
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);
    var playerConfigs = gameHistory.playerConfigs.map(pc => ({id: pc.id, type: "human"}));

    var game = GameFactory().create({
        playerConfigs: playerConfigs,
        map: gameHistory.map,
        seed: gameHistory.seed
    });

    var localGameState = {
        paused: false,
        replayUpdateIndex: 0
    };

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
                game.setPlayerSteering(game.gameState.players[index].id, steering); //TODO should only update when player actually pressed key
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
        off: game.off.bind(game),
        events: game.events,
        gameState: game.gameState
    };
};
