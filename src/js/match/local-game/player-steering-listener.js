var steering = require("core/src/core/player/player.js").steering;


/**
 * Note that this listener setups listening on document so we NEED to remove the listeners once we are done listening
 */
module.exports = function PlayerSteeringListener(game) {

    var listeners = [];

    function addListener(event, keyCode, callback) {
        function eventHandler (event) {
            if (keyCode === event.keyCode) {
                callback();
            }
        }
        listeners.push({event: event, function: eventHandler});
        document.addEventListener(event, eventHandler);
    }

    function addKeyListeners(playerId, leftKey, rightKey) {
        var leftKeyPressed = false;
        var rightKeyPressed = false;
        addListener("keydown", leftKey, function () {
            leftKeyPressed = true;
            updatePlayerSteering();
        });

        addListener("keyup", leftKey, function () {
            leftKeyPressed = false;
            updatePlayerSteering();
        });

        addListener("keydown", rightKey, function () {
            rightKeyPressed = true;
            updatePlayerSteering();
        });

        addListener("keyup", rightKey, function () {
            rightKeyPressed = false;
            updatePlayerSteering();
        });

        function updatePlayerSteering() {
            var newSteering = leftKeyPressed * steering.LEFT + rightKeyPressed * steering.RIGHT;
            game.setPlayerSteering(playerId, newSteering);
        }
    }

    function removeKeyListeners() {
        listeners.forEach(function(listener) {
            document.removeEventListener(listener.event, listener.function);
        });
    }

    return {
        addKeyListeners: addKeyListeners,
        removeKeyListeners: removeKeyListeners
    };
};