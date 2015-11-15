var speedEffectType = require("core/src/power-up/effect-handlers/speed-effect-handler.js").type;
var fatEffectType = require("core/src/power-up/effect-handlers/fat-effect-handler.js").type;
var wormSwitchEffectType = require("core/src/power-up/effect-handlers/worm-switch-effect-handler.js").type;
var fastTurnSpeedEffectType = require("core/src/power-up/effect-handlers/fast-turn-speed-effect-handler.js").type;

module.exports = function PowerUpRenderer(gameState, powerUpContext, shapeRenderer, renderProperties) {

    var render = function () {
        powerUpContext.clearRect(0, 0, powerUpContext.canvas.width, powerUpContext.canvas.height);
        gameState.powerUps.forEach(function renderPowerUp(powerUp) {
            var color = "pink";
            if (powerUp.effectType === speedEffectType) {
                color = "aqua";
            } else if (powerUp.effectType === fatEffectType) {
                color = "orange";
            } else if (powerUp.effectType === wormSwitchEffectType) {
                color = "black";
            } else if (powerUp.effectType === fastTurnSpeedEffectType) {
                color = "red";
            }
            shapeRenderer.render(powerUpContext, powerUp.shape, color);
        });
    };

    return {
        render: render
    };
};