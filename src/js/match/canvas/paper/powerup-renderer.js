var forEach = require("core/src/core/util/for-each.js");

module.exports = function PowerUpRenderer(paperScope) {
    var powerUpLayer = new paperScope.Layer();
    var powerUps = {};

    function update(gameState) {
        powerUpLayer.activate();
        var updatedPowerUps = {};
        gameState.powerUps.forEach(function (powerUp) {
            if (powerUps[powerUp.id] !== undefined) {
                updatedPowerUps[powerUp.id] = powerUps[powerUp.id];
            } else {
                var circle = new paperScope.Shape.Circle([powerUp.shape.centerX, powerUp.shape.centerY], powerUp.shape.radius);
                if (powerUp.affects === "self") {
                    circle.fillColor = "green";
                } else if (powerUp.affects === "others") {
                    circle.fillColor = "red";
                } else {
                    circle.fillColor = "blue";
                }
                var text = new paperScope.PointText([powerUp.shape.centerX, powerUp.shape.centerY]);
                text.characterStyle = {
                    fontSize: 14,
                    fillColor:"white",
                    font:"Arial"
                };
                text.content = powerUp.name;
                text.justification = "center";
                updatedPowerUps[powerUp.id] = {
                    circle: circle,
                    text: text
                };
            }
        });
        forEach(powerUps, function(powerUp, id) {
            if (updatedPowerUps[id] === undefined) {
                // Remove powerup
                powerUp.circle.remove();
                powerUp.text.remove();
            }
        });
        powerUps = updatedPowerUps;
    }

    return {
        update: update
    };
}
