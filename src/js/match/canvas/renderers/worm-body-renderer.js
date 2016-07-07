var gameStateFunctions = require("core/src/core/game-state-functions.js");
    
module.exports = function WormBodyRenderer(options) {
    var playerConfigs = options.playerConfigs;
    var canvas = options.canvas;
    var context = canvas.getContext("2d");

    function renderWormSegment(gameState, wormId, wormSegmentId) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        var wormSegment = worm.pathSegments[wormSegmentId];
        if (wormSegment.jump) {
            return;
        }

        context.lineWidth = wormSegment.size;
        context.lineCap = "round";
        context.strokeStyle = playerConfigs.find(pc => pc.id === wormSegment.playerId).color.hexCode;
        // Draw path
        context.beginPath();
        if (wormSegment.type === "straight") {
            context.moveTo(wormSegment.startX, wormSegment.startY);
            context.lineTo(wormSegment.endX, wormSegment.endY);
        } else {
            // Arc
            if (wormSegment.speed > 0) {
                context.arc(wormSegment.arcCenterX, wormSegment.arcCenterY, wormSegment.arcRadius, wormSegment.arcStartAngle, wormSegment.arcEndAngle, wormSegment.arcAngleDiff < 0);
            }
        }
        context.stroke();
    }
    
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render(gameState, prevUpdateTime) {
        var lastClearTime = gameStateFunctions.getLatestClearTime(gameState);
        if (lastClearTime > prevUpdateTime && lastClearTime <= gameState.gameTime) {
            clear();
        }
        gameState.worms.forEach(function (worm) {
            var segments = worm.pathSegments;
            if (segments.length > 0) {
                if (prevUpdateTime === 0) {
                    for (var i = 0; i < segments.length; i++) {
                        renderWormSegment(gameState, worm.id, i);
                    }
                } else {
                    renderWormSegment(gameState, worm.id, segments.length - 1);
                }
            }
        });
    }
   
    return {
        clear: clear,
        render: render
    };
}
