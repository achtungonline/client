var speedEffectType = require("core/src/power-up/effect-handlers/speed-effect-handler.js").type;
var fatEffectType = require("core/src/power-up/effect-handlers/fat-effect-handler.js").type;

module.exports = function PowerUpRenderer(gameState, powerUpContext, shapeRenderer, renderProperties) {

    var render = function () {
        powerUpContext.clearRect(0, 0, powerUpContext.canvas.width, powerUpContext.canvas.height);
        gameState.powerUps.forEach(function renderPowerUp(powerUp) {
            var color = "pink";
            if (powerUp.effectType === speedEffectType) {
                color = "aqua";
            } else if (powerUp.effectType === fatEffectType) {
                color = "orange";
            }
            shapeRenderer.render(powerUpContext, powerUp.shape, color);
        });
    };

    return {
        render: render
    };
};