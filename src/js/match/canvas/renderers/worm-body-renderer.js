var gameStateFunctions = require("core/src/core/game-state-functions.js");

module.exports = function WormBodyRenderer(options) {
    var playerConfigs = options.playerConfigs;
    var mainCanvas = options.mainCanvas;
    var mainContext = mainCanvas.getContext("2d");
    var secondaryCanvas = options.secondaryCanvas;
    var secondaryContext = secondaryCanvas.getContext("2d");
    var wormRenderData = {};

    function getWormRenderData(wormId) {
        if (wormRenderData[wormId] === undefined) {
            wormRenderData[wormId] = {
                mainSegmentIndex: 0
            };
        }
        return wormRenderData[wormId];
    }

    function renderWormSegment(gameState, renderStartTime, wormId, wormSegmentId, context) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        var wormSegment = worm.pathSegments[wormSegmentId];
        if (wormSegment.jump || renderStartTime >= wormSegment.endTime) {
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
        mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        secondaryContext.clearRect(0, 0, secondaryCanvas.width, secondaryCanvas.height);
    }

    function render(gameState, renderStartTime, renderEndTime) {
        var lastClearTime = gameStateFunctions.getLastClearTime(gameState, renderEndTime);
        if (lastClearTime > renderStartTime && lastClearTime <= renderEndTime) {
            clear();
        }

        secondaryContext.clearRect(0, 0, secondaryCanvas.width, secondaryCanvas.height);
        gameState.worms.forEach(function (worm) {
            var renderData = getWormRenderData(worm.id);
            var segments = worm.pathSegments;
            if (segments.length > 0) {
                var lastSegmentIndex = segments.length - 1;
                // Render completed segments to the main canvas
                for (var i = renderData.mainSegmentIndex; i < lastSegmentIndex; i++) {
                    renderWormSegment(gameState, Math.max(segments[i].startTime, lastClearTime), worm.id, i, mainContext);
                    renderData.mainSegmentIndex++;
                }
                // Render the last segment to the secondary canvas
                renderWormSegment(gameState, Math.max(segments[lastSegmentIndex].startTime, lastClearTime), worm.id, lastSegmentIndex, secondaryContext);
            }
        });
    }

    return {
        render: render
    };
}
