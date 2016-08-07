var Animator = require("../animation/animator.js");

var forEach = require("core/src/core/util/for-each.js");

var POWERUP_SPAWN_DURATION = 0.3;
var POWERUP_DESPAWN_DURATION = 0.1;
var POWERUP_COLORS = {
    "self": "green",
    "others": "red",
    "all": "blue"
};

var POWERUP_IMAGE_URLS = {
    "Clear": "src/css/svg/powerup/clear.svg",
    "Drunk": "src/css/svg/powerup/drunk.svg",
    "Fat": "src/css/svg/powerup/fat.svg",
    "Slim": "src/css/svg/powerup/slim.svg",
    "Slow": "src/css/svg/powerup/slow.svg",
    "Slow Turn": "src/css/svg/powerup/slowturn.svg",
    "Speed": "src/css/svg/powerup/speed.svg",
    "Super Jump": "src/css/svg/powerup/superjump.svg",
    "Switcharoonie": "src/css/svg/powerup/switcharoonie.svg",
    "Switch Keys": "src/css/svg/powerup/switchkeys.svg",
    "Tron Turn": "src/css/svg/powerup/tronturn.svg",
    "Quick Turn": "src/css/svg/powerup/quickturn.svg"
};


module.exports = function PowerUpRenderer(options) {

    var canvas = options.canvas;
    var context = canvas.getContext("2d");

    var animator = Animator();

    var powerUpRenderData = {};

    function updateRenderData(gameState, renderStartTime, renderEndTime) {
        forEach(powerUpRenderData, function (renderData) {
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
                    name: powerUp.name,
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
                    endCallback: function () {
                        renderData.visibleText = true;
                    }
                });
            } else {
                powerUpRenderData[powerUp.id].activeCurrentUpdate = true;
            }
        });
        forEach(powerUpRenderData, function (renderData, id) {
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
                    endCallback: function () {
                        delete powerUpRenderData[id];
                    }
                });
            }
        });
    }

    function renderPowerUps() {
        forEach(powerUpRenderData, function (renderData) {
            var powerUpImageUrl = POWERUP_IMAGE_URLS[renderData.name];

            if (powerUpImageUrl) {
                var imageElement = document.createElement('img');
                imageElement.src = powerUpImageUrl;
                context.drawImage(imageElement, renderData.centerX - renderData.radius, renderData.centerY - renderData.radius, renderData.radius * 2, renderData.radius * 2);
            } else {
                // We have no image yet, use default behaviour
                context.fillStyle = renderData.color;
                context.beginPath();
                context.arc(renderData.centerX, renderData.centerY, renderData.radius, 0, 2 * Math.PI);
                context.fill();

                if (renderData.visibleText) {
                    context.font = "14px Arial";
                    context.textAlign = "center";
                    context.textBaseline = "middle";
                    context.fillStyle = "white";
                    context.fillText(renderData.name, renderData.centerX, renderData.centerY);
                }
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
