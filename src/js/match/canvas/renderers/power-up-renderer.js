var Animator = require("../animation/animator.js");

var forEach = require("core/src/core/util/for-each.js");

var POWERUP_SPAWN_DURATION = 0.3;
var POWERUP_DESPAWN_DURATION = 0.1;
var POWERUP_COLORS = {
    "self": "green",
    "others": "red",
    "all": "blue"
};

module.exports = function PowerUpRenderer(options) {

    var canvas = options.canvas;
    var context = canvas.getContext("2d");

    var animator = Animator();
    var powerUpRenderData = {};

    function updateRenderData(gameState, renderStartTime, renderEndTime) {
        forEach(powerUpRenderData, function(renderData) {
            renderData.activeCurrentUpdate = false;
        });
        gameState.powerUps.forEach(function renderPowerUp(powerUp) {
            if (powerUpRenderData[powerUp.id] === undefined) {
                // New powerUp spawned
                var renderData = {
                    centerX: powerUp.shape.centerX,
                    centerY: powerUp.shape.centerY,
                    radius: 0,
                    color: POWERUP_COLORS[powerUp.affects],
                    text: powerUp.name,
                    active: true,
                    activeCurrentUpdate: true,
                    visibleText: false
                };
                powerUpRenderData[powerUp.id] = renderData;

                animator.startAnimation({
                    item: renderData,
                    property: "radius",
                    change: powerUp.shape.radius,
                    startTime: renderStartTime,
                    duration: POWERUP_SPAWN_DURATION,
                    endCallback: function() {
                        renderData.visibleText = true;
                    }
                });
            } else {
                powerUpRenderData[powerUp.id].activeCurrentUpdate = true;
            }
        });
        forEach(powerUpRenderData, function(renderData, id) {
            if (renderData.active && !renderData.activeCurrentUpdate) {
                // PowerUp despawned
                renderData.visibleText = false;
                renderData.active = false;
                animator.startAnimation({
                    item: renderData,
                    property: "radius",
                    change: -renderData.radius,
                    startTime: renderStartTime,
                    duration: POWERUP_DESPAWN_DURATION,
                    endCallback: function() {
                        delete powerUpRenderData[id];
                    }
                });
            }
        });
    }

    function renderPowerUps() {
        forEach(powerUpRenderData, function(renderData) {
            context.fillStyle = renderData.color;
            context.beginPath();
            context.arc(renderData.centerX, renderData.centerY, renderData.radius, 0, 2 * Math.PI);
            context.fill();

            if (renderData.visibleText) {
                context.font = "14px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "white";
                context.fillText(renderData.text, renderData.centerX, renderData.centerY);
            }
        });
    }

    function render(gameState, renderStartTime, renderEndTime) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        updateRenderData(gameState, renderStartTime, renderEndTime);
        animator.update(renderStartTime, renderEndTime);
        renderPowerUps();
    };

    return {
        render: render
    };
};
