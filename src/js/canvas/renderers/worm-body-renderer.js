var forEach = require("core/src/core/util/for-each.js");
var wormColors = require("core/src/core/constants.js").wormColors;

var ScaledCanvasContext = require("../scaled-canvas-context.js");

var CLEAR_FADE_DURATION = 0.2;

module.exports = function WormBodyRenderer({ gameState, players, fadeCanvas, mainCanvas, secondaryCanvas, scale=1 }) {
    var fadeContext = fadeCanvas.getContext("2d");
    var mainContext = mainCanvas.getContext("2d");
    var scaledMainContext = ScaledCanvasContext(mainContext, scale);
    var secondaryContext = secondaryCanvas.getContext("2d");
    var scaledSecondaryContext = ScaledCanvasContext(secondaryContext, scale);
    var temporaryCanvas = document.createElement("canvas");
    temporaryCanvas.width = fadeCanvas.width;
    temporaryCanvas.height = fadeCanvas.height;
    var temporaryContext = temporaryCanvas.getContext("2d");

    var wormRenderData = {};
    var prevRenderTime = 0;
    var fadeStartTime;

    function getWormRenderData(wormId) {
        if (wormRenderData[wormId] === undefined) {
            wormRenderData[wormId] = {
                mainSegmentIndex: 0
            };
        }
        return wormRenderData[wormId];
    }

    function clearRenderData() {
        forEach(wormRenderData, function(renderData) {
            renderData.mainSegmentIndex = 0;
        });
    }

    function renderWormSegment({ renderTime, wormId, wormSegmentId, context, scaledContext }) {
        var wormSegment = gameState.wormPathSegments[wormId][wormSegmentId];
        if (wormSegment.jump || wormSegment.type === "still_arc") {
            return;
        }

        var renderStartTime = wormSegment.startTime;

        if (renderTime > wormSegment.endTime) {
            renderTime = wormSegment.endTime;
        }

        var startPercentage = (renderStartTime - wormSegment.startTime) / wormSegment.duration;
        var endPercentage = (renderTime - wormSegment.startTime) / wormSegment.duration;

        context.lineWidth = scale*wormSegment.size*2;
        context.lineCap = "round";
        context.strokeStyle = wormColors[players.find(p => p.id === wormSegment.playerId).colorId];
        // Draw path
        context.beginPath();
        if (wormSegment.type === "straight") {
            var startX = wormSegment.startX + startPercentage*(wormSegment.endX - wormSegment.startX);
            var startY = wormSegment.startY + startPercentage*(wormSegment.endY - wormSegment.startY);
            var endX = wormSegment.startX + endPercentage*(wormSegment.endX - wormSegment.startX);
            var endY = wormSegment.startY + endPercentage*(wormSegment.endY - wormSegment.startY);
            scaledContext.moveTo(startX, startY);
            scaledContext.lineTo(endX, endY);
        } else {
            // Arc
            if (wormSegment.speed > 0) {
                var startAngle = wormSegment.arcStartAngle + startPercentage*wormSegment.arcAngleDiff;
                var endAngle = wormSegment.arcStartAngle + endPercentage*wormSegment.arcAngleDiff;
                scaledContext.arc(wormSegment.arcCenterX, wormSegment.arcCenterY, wormSegment.arcRadius, startAngle, endAngle, wormSegment.arcAngleDiff < 0);
            }
        }
        context.stroke();

    }

    function render(renderTime) {
        if (renderTime === prevRenderTime) {
            return;
        }
        secondaryContext.clearRect(0, 0, secondaryCanvas.width, secondaryCanvas.height);
        if (renderTime < prevRenderTime) {
            // TODO Perform this more efficiently
            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
            fadeContext.clearRect(0, 0, fadeCanvas.width, fadeCanvas.height);
            fadeStartTime = undefined;
            clearRenderData();
        }


        // Check for clears
        var performClear = false;
        forEach(gameState.wormPathSegments, function (segments, wormId) {
            var renderData = getWormRenderData(wormId);
            for (var i = renderData.mainSegmentIndex; i < segments.length && segments[i].startTime <= renderTime; i++) {
                if (segments[i].metaData.find((md) => md.type === "clear")) {
                    renderData.mainSegmentIndex = i + 1;
                    performClear = true;
                }
            }
        });
        if (performClear) {
            // Move segmentIndex for each worm to be the same index as the latest clear
            forEach(gameState.wormPathSegments, function (segments, wormId) {
                var renderData = getWormRenderData(wormId);
                while (renderData.mainSegmentIndex > 0 && !segments[renderData.mainSegmentIndex].metaData.find((md) => md.type === "clear")) {
                    renderData.mainSegmentIndex--;
                }
                renderData.mainSegmentIndex++;
            });
            // Perform the clear
            temporaryContext.drawImage(mainCanvas, 0, 0);
            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            fadeStartTime = renderTime;
        }

        // Now render normally
        forEach(gameState.wormPathSegments, function (segments, wormId) {
            var renderData = getWormRenderData(wormId);
            if (segments.length > 0) {
                // Render completed segments to the main canvas
                while (renderData.mainSegmentIndex < segments.length - 1 && segments[renderData.mainSegmentIndex].endTime <= renderTime) {
                    renderWormSegment({
                        renderTime,
                        wormId,
                        wormSegmentId: renderData.mainSegmentIndex,
                        context: mainContext,
                        scaledContext: scaledMainContext
                    });
                    renderData.mainSegmentIndex++;
                }
                // Render the last segment to the secondary canvas
                if (renderData.mainSegmentIndex < segments.length && segments[renderData.mainSegmentIndex].startTime <= renderTime) {
                    renderWormSegment({
                        renderTime,
                        wormId,
                        wormSegmentId: renderData.mainSegmentIndex,
                        context: secondaryContext,
                        scaledContext: scaledSecondaryContext
                    });
                }
            }
        });

        // Render fade animation
        if (fadeStartTime !== undefined) {
            fadeContext.clearRect(0, 0, fadeCanvas.width, fadeCanvas.height);
            var fadeProgress = (renderTime - fadeStartTime) / CLEAR_FADE_DURATION;
            if (fadeProgress > 1) {
                fadeStartTime = undefined;
                temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
            } else {
                fadeContext.globalAlpha = 1 - fadeProgress;
                fadeContext.drawImage(temporaryCanvas, 0, 0);
            }
        }

        prevRenderTime = renderTime;
    }

    return {
        render: render
    };
};
