var steering = require("core/src/core/player/player.js").steering;
var KeyListenerFactory = require("./../../game-module/key-listener-factory.js");


module.exports = function PlayerSteeringListener(game) {
    var keyListenerHandler = KeyListenerFactory().create();

    function addListener(playerId, leftKey, rightKey) {
        var leftKeyPressed = false;
        var rightKeyPressed = false;
        keyListenerHandler.onKeyPressed(leftKey, function () {
            leftKeyPressed = true;
            updatePlayerSteering();
        });

        keyListenerHandler.onKeyReleased(leftKey, function () {
            leftKeyPressed = false;
            updatePlayerSteering();
        });

        keyListenerHandler.onKeyPressed(rightKey, function () {
            rightKeyPressed = true;
            updatePlayerSteering();
        });

        keyListenerHandler.onKeyReleased(rightKey, function () {
            rightKeyPressed = false;
            updatePlayerSteering();
        });

        function updatePlayerSteering() {
            var newSteering = leftKeyPressed * steering.LEFT + rightKeyPressed * steering.RIGHT;
            game.setPlayerSteering(playerId, newSteering);
        }
    }
    return {
        addListener: addListener
    };
};
