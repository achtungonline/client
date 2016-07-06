var Animator = require("./animator.js");

var forEach = require("core/src/core/util/for-each.js");

module.exports = function PowerUpRenderer(paperScope) {
    var powerUpLayer = new paperScope.Layer();
    var powerUps = {};
    var animator = Animator();

    function update(gameState) {
        powerUpLayer.activate();
        animator.update(gameState);

        var updatedPowerUps = {};
        gameState.powerUps.forEach(function (powerUp) {
            if (powerUps[powerUp.id] !== undefined) {
                updatedPowerUps[powerUp.id] = powerUps[powerUp.id];
            } else {
                var circle = new paperScope.Shape.Circle([powerUp.shape.centerX, powerUp.shape.centerY], 0);
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
                text.visible = false;
                text.content = powerUp.name;
                text.justification = "center";

                animator.startAnimation(gameState, {
                    item: circle,
                    property: "radius",
                    change: powerUp.shape.radius,
                    duration: 0.3,
                    endCallback: function () {
                        text.visible = true;
                    }
                });

                updatedPowerUps[powerUp.id] = {
                    circle: circle,
                    text: text
                };
            }
        });
        forEach(powerUps, function(powerUp, id) {
            if (updatedPowerUps[id] === undefined) {
                // Remove powerup
                animator.startAnimation(gameState, {
                    item: powerUp.circle,
                    property: "radius",
                    change: -powerUp.circle.radius,
                    duration: 0.1,
                    endCallback: function () {
                        powerUp.circle.remove();
                    }
                });
                powerUp.text.remove();
            }
        });
        powerUps = updatedPowerUps;
    }

    return {
        update: update
    };
}
