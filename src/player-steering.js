var steering = require("core/src/player/player.js").steering;

module.exports = function PlayerSteering(keyListenerHandler, game) {

    function addSteering(player, leftKey, rightKey) {
        keyListenerHandler.onKeyPressed(leftKey, function () {
            game.setPlayerSteering(player, steering.LEFT);
        });

        keyListenerHandler.onKeyReleased(leftKey, function () {
            game.setPlayerSteering(player, steering.STRAIGHT);
        });

        keyListenerHandler.onKeyPressed(rightKey, function () {
            game.setPlayerSteering(player, steering.RIGHT);
        });

        keyListenerHandler.onKeyReleased(rightKey, function () {
            game.setPlayerSteering(player, steering.STRAIGHT);
        });
    }

    return {
        addSteering: addSteering
    }
};
