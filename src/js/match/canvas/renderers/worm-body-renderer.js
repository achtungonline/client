var gameStateFunctions = require("core/src/core/game-state-functions.js");

var CLEAR_FADE_DURATION = 0.3;

module.exports = function WormBodyRenderer(options) {
    var playerConfigs = options.playerConfigs;
    var fadeCanvas = options.fadeCanvas;
    var fadeContext = fadeCanvas.getContext("2d");
    var mainCanvas = options.mainCanvas;
    var mainContext = mainCanvas.getContext("2d");
    var secondaryCanvas = options.secondaryCanvas;
    var secondaryContext = secondaryCanvas.getContext("2d");
    var temporaryCanvas = document.createElement("canvas");
    temporaryCanvas.width = fadeCanvas.width;
    temporaryCanvas.height = fadeCanvas.height;
    var temporaryContext = temporaryCanvas.getContext("2d");

    var wormRenderData = {};
    var fadeStartTime;

    function getWormRenderData(wormId) {
        if (wormRenderData[wormId] === undefined) {
            wormRenderData[wormId] = {
                mainSegmentIndex: 0
            };
        }
        return wormRenderData[wormId];
    }

    function renderWormSegment(renderOptions) {
        var gameState = renderOptions.gameState;
        var renderStartTime = renderOptions.renderStartTime;
        var renderEndTime = renderOptions.renderEndTime;
        var wormId = renderOptions.wormId;
        var wormSegmentId = renderOptions.wormSegmentId;
        var context = renderOptions.context;

        var wormSegment = gameState.wormPathSegments[wormId][wormSegmentId];
        if (wormSegment.jump || wormSegment.type === "still_arc" || wormSegment.type === "clear" || renderStartTime >= wormSegment.endTime) {
            return;
        }

        if (renderStartTime === undefined || renderStartTime < wormSegment.startTime) {
            renderStartTime = wormSegment.startTime;
        }
        if (renderEndTime === undefined || renderEndTime > wormSegment.endTime) {
            renderEndTime = wormSegment.endTime;
        }

        var startPercentage = (renderStartTime - wormSegment.startTime) / wormSegment.duration;
        var endPercentage = (renderEndTime - wormSegment.startTime) / wormSegment.duration;

        context.lineWidth = wormSegment.size;
        context.lineCap = "round";
        context.strokeStyle = playerConfigs.find(pc => pc.id === wormSegment.playerId).color.hexCode;
        // Draw path
        context.beginPath();
        if (wormSegment.type === "straight") {
            var startX = wormSegment.startX + startPercentage*(wormSegment.endX - wormSegment.startX);
            var startY = wormSegment.startY + startPercentage*(wormSegment.endY - wormSegment.startY);
            var endX = wormSegment.startX + endPercentage*(wormSegment.endX - wormSegment.startX);
            var endY = wormSegment.startY + endPercentage*(wormSegment.endY - wormSegment.startY);
            context.moveTo(startX, startY);
            context.lineTo(endX, endY);
        } else {
            // Arc
            if (wormSegment.speed > 0) {
                var startAngle = wormSegment.arcStartAngle + startPercentage*wormSegment.arcAngleDiff;
                var endAngle = wormSegment.arcStartAngle + endPercentage*wormSegment.arcAngleDiff;
                context.arc(wormSegment.arcCenterX, wormSegment.arcCenterY, wormSegment.arcRadius, startAngle, endAngle, wormSegment.arcAngleDiff < 0);
            }
        }
        context.stroke();

    }

    function render(gameState, renderStartTime, renderEndTime) {
        secondaryContext.clearRect(0, 0, secondaryCanvas.width, secondaryCanvas.height);

        // Check for clears
        var performClear = false;
        gameState.worms.forEach(function (worm) {
            var renderData = getWormRenderData(worm.id);
            var segments = gameState.wormPathSegments[worm.id];
            for (var i = renderData.mainSegmentIndex; i < segments.length && segments[i].endTime <= renderEndTime; i++) {
                if (segments[i].type === "clear") {
                    renderData.mainSegmentIndex = i + 1;
                    performClear = true;
                }
            }
        });
        if (performClear) {
            // Move segmentIndex for each worm to be just after the last clear
            gameState.worms.forEach(function (worm) {
                var renderData = getWormRenderData(worm.id);
                var segments = gameState.wormPathSegments[worm.id];
                while (renderData.mainSegmentIndex > 0 && segments[renderData.mainSegmentIndex - 1].type !== "clear") {
                    renderData.mainSegmentIndex--;
                }
            });
            // Perform the clear
            temporaryContext.drawImage(mainCanvas, 0, 0);
            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            fadeStartTime = renderEndTime;
        }

        // Now render normally
        gameState.worms.forEach(function (worm) {
            var renderData = getWormRenderData(worm.id);
            var segments = gameState.wormPathSegments[worm.id];
            if (segments.length > 0) {
                // Render completed segments to the main canvas
                while (renderData.mainSegmentIndex < segments.length - 1 && segments[renderData.mainSegmentIndex].endTime <= renderEndTime) {
                    renderWormSegment({
                        gameState: gameState,
                        wormId: worm.id,
                        wormSegmentId: renderData.mainSegmentIndex,
                        context: mainContext
                    });
                    renderData.mainSegmentIndex++;
                }
                // Render the last segment to the secondary canvas
                if (renderData.mainSegmentIndex < segments.length) {
                    renderWormSegment({
                        gameState: gameState,
                        renderEndTime: renderEndTime,
                        wormId: worm.id,
                        wormSegmentId: renderData.mainSegmentIndex,
                        context: secondaryContext
                    });
                }
            }
        });

        // Render fade animation
        if (fadeStartTime !== undefined) {
            fadeContext.clearRect(0, 0, fadeCanvas.width, fadeCanvas.height);
            var fadeProgress = (renderEndTime - fadeStartTime) / CLEAR_FADE_DURATION;
            if (fadeProgress > 1) {
                fadeStartTime = undefined;
                temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
            } else {
                fadeContext.globalAlpha = 1 - fadeProgress;
                fadeContext.drawImage(temporaryCanvas, 0, 0);
            }
        }
    }

    return {
        render: render
    };
};
