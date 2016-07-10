var gameStateFunctions = require("core/src/core/game-state-functions.js");

module.exports = function WormBodyRenderer(options) {
    var playerConfigs = options.playerConfigs;
    var canvas = options.canvas;
    var context = canvas.getContext("2d");

    function renderWormSegment(gameState, renderStartTime, wormId, wormSegmentId) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        var wormSegment = worm.pathSegments[wormSegmentId];
        if (wormSegment.jump) {
            return;
        }

        var startPercentage = (renderStartTime - wormSegment.startTime) / wormSegment.duration;

        context.lineWidth = wormSegment.size;
        context.lineCap = "round";
        context.strokeStyle = playerConfigs.find(pc => pc.id === wormSegment.playerId).color.hexCode;
        // Draw path
        context.beginPath();
        if (wormSegment.type === "straight") {
            var startX = wormSegment.startX + startPercentage*(wormSegment.endX - wormSegment.startX);
            var startY = wormSegment.startY + startPercentage*(wormSegment.endY - wormSegment.startY);
            context.moveTo(startX, startY);
            context.lineTo(wormSegment.endX, wormSegment.endY);
        } else {
            // Arc
            if (wormSegment.speed > 0) {
                var startAngle = wormSegment.arcStartAngle + startPercentage*wormSegment.arcAngleDiff;
                context.arc(wormSegment.arcCenterX, wormSegment.arcCenterY, wormSegment.arcRadius, startAngle, wormSegment.arcEndAngle, wormSegment.arcAngleDiff < 0);
            }
        }
        context.stroke();
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render(gameState, renderStartTime, renderEndTime) {
        var lastClearTime = gameStateFunctions.getLastClearTime(gameState, renderEndTime);
        if (lastClearTime > renderStartTime && lastClearTime <= renderEndTime) {
            clear();
        }
        gameState.worms.forEach(function (worm) {
            var segments = worm.pathSegments;
            if (segments.length > 0) {
                if (renderStartTime === 0) {
                    for (var i = 0; i < segments.length; i++) {
                        if (lastClearTime < segments[i].endTime) {
                            renderWormSegment(gameState, Math.max(segments[i].startTime, lastClearTime), worm.id, i);
                        }
                    }
                } else {
                    var lastSegment = segments[segments.length - 1];
                    if (lastClearTime < lastSegment.endTime) {
                        renderWormSegment(gameState, Math.max(lastSegment.startTime, lastClearTime), worm.id, segments.length - 1);
                    }
                }
            }
        });
    }

    return {
        render: render
    };
}
