var forEach = require("core/src/core/util/for-each.js");

var ScaledCanvasContext = require("../scaled-canvas-context.js");

var POWERUP_SPAWN_DURATION = 0.3;
var POWERUP_DESPAWN_DURATION = 0.1;
var POWERUP_COLORS = {
    "self": "#008000",
    "others": "#FF0B0B",
    "all": "#3453BC"
};

var POWERUP_IMAGE_URLS = {
    "clear": "svg/powerup/clear.svg",
    "drunk": "svg/powerup/drunk.svg",
    "fat": "svg/powerup/fat.svg",
    "slim": "svg/powerup/slim.svg",
    "slow": "svg/powerup/slow.svg",
    "slow_turn": "svg/powerup/slowturn.svg",
    "speed": "svg/powerup/speed.svg",
    "super_jump": "svg/powerup/superjump.svg",
    "switcharoonie": "svg/powerup/switcharoonie.svg",
    "key_switch": "svg/powerup/switchkeys.svg",
    "tron_turn": "svg/powerup/tronturn.svg",
    "quick_turn": "svg/powerup/quickturn.svg",
    "twin": "svg/powerup/twin.svg",
    "wall_hack": "svg/powerup/wallhack.svg"
};


module.exports = function PowerUpRenderer({ gameState, canvas, scale=1 }) {

    var context = canvas.getContext("2d");
    var scaledContext = ScaledCanvasContext(context, scale);

    var prevRenderTime = 0;
    var powerUpEventIndex = 0;
    var powerUpRenderData = {};

    function updateRenderData(renderTime) {
        if (renderTime < prevRenderTime) {
            // TODO do this more efficiently
            powerUpRenderData = {};
            powerUpEventIndex = 0;
        }
        var powerUpEvents = gameState.powerUpEvents;
        while (powerUpEventIndex < powerUpEvents.length && powerUpEvents[powerUpEventIndex].time <= renderTime) {
            var powerUpEvent = powerUpEvents[powerUpEventIndex];
            powerUpEventIndex++;
            if (powerUpEvent.type === "spawn") {
                var powerUp = powerUpEvent.powerUp;
                powerUpRenderData[powerUp.id] = {
                    centerX: powerUp.shape.centerX,
                    centerY: powerUp.shape.centerY,
                    radius: powerUp.shape.radius,
                    color: POWERUP_COLORS[powerUp.affects],
                    name: powerUp.name,
                    spawnTime: powerUpEvent.time,
                    despawnTime: Infinity
                };
            } else if (powerUpEvent.type === "despawn") {
                powerUpRenderData[powerUpEvent.id].despawnTime = powerUpEvent.time;
            } else {
                throw new Error("Unknown powerUp event type: " + powerUpEvent.type);
            }
        }
        forEach(powerUpRenderData, function (renderData, id) {
            if (renderTime - renderData.despawnTime >= POWERUP_DESPAWN_DURATION) {
                delete powerUpRenderData[id];
            }
        });

        prevRenderTime = renderTime;
    }

    function renderPowerUps(renderTime) {
        forEach(powerUpRenderData, function (renderData) {
            var radius = renderData.radius;
            var text = "";
            if (renderTime < renderData.spawnTime + POWERUP_SPAWN_DURATION) {
                radius *= (renderTime - renderData.spawnTime) / POWERUP_SPAWN_DURATION;
            } else if (renderTime > renderData.despawnTime) {
                radius *= (renderData.despawnTime + POWERUP_DESPAWN_DURATION - renderTime) / POWERUP_DESPAWN_DURATION;
            } else {
                text = renderData.name;
            }

            var powerUpImageUrl = POWERUP_IMAGE_URLS[renderData.name];
            context.fillStyle = renderData.color;
            context.beginPath();
            scaledContext.arc(renderData.centerX, renderData.centerY, radius, 0, 2 * Math.PI);
            context.fill();
            if (powerUpImageUrl) {
                context.beginPath();
                var imageElement = document.createElement("img");
                imageElement.src = powerUpImageUrl;
                scaledContext.drawImage(imageElement, renderData.centerX - radius, renderData.centerY - radius, radius * 2, radius * 2);
            } else {
                // We have no image yet, use default behaviour
                context.font = scale*14 + "px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "white";
                scaledContext.fillText(text, renderData.centerX, renderData.centerY);
            }
        });
    }

    function render(renderTime) {
        if (renderTime !== prevRenderTime) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            updateRenderData(renderTime);
            renderPowerUps(renderTime);
        }
    }

    return {
        render: render
    };
};
