var steering = require("core/src/player/player.js").steering;

module.exports = function PlayerSteeringListener(keyListenerHandler, game) {

    function addListener(player, leftKey, rightKey) {
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
            game.setPlayerSteering(player, newSteering);
        }
    }
    return {
        addListener: addListener
    }
};
