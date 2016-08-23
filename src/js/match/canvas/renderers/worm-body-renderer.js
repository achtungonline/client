var gameStateFunctions = require("core/src/core/game-state-functions.js");
var forEach = require("core/src/core/util/for-each.js");

var CLEAR_FADE_DURATION = 0.2;

module.exports = function WormBodyRenderer({ gameState, playerConfigs, fadeCanvas, mainCanvas, secondaryCanvas }) {
    var fadeContext = fadeCanvas.getContext("2d");
    var mainContext = mainCanvas.getContext("2d");
    var secondaryContext = secondaryCanvas.getContext("2d");
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

    function renderWormSegment({ renderTime, wormId, wormSegmentId, context }) {
        var wormSegment = gameState.wormPathSegments[wormId][wormSegmentId];
        if (wormSegment.jump || wormSegment.type === "still_arc" || wormSegment.type === "clear") {
            return;
        }

        var renderStartTime = wormSegment.startTime;
        if (renderTime === undefined || renderTime > wormSegment.endTime) {
            renderTime = wormSegment.endTime;
        }

        var startPercentage = (renderStartTime - wormSegment.startTime) / wormSegment.duration;
        var endPercentage = (renderTime - wormSegment.startTime) / wormSegment.duration;

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

    function render(renderTime) {
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
            for (var i = renderData.mainSegmentIndex; i < segments.length && segments[i].endTime <= renderTime; i++) {
                if (segments[i].type === "clear") {
                    renderData.mainSegmentIndex = i + 1;
                    performClear = true;
                }
            }
        });
        if (performClear) {
            // Move segmentIndex for each worm to be just after the last clear
            forEach(gameState.wormPathSegments, function (segments, wormId) {
                var renderData = getWormRenderData(wormId);
                while (renderData.mainSegmentIndex > 0 && segments[renderData.mainSegmentIndex - 1].type !== "clear") {
                    renderData.mainSegmentIndex--;
                }
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
                        wormId,
                        wormSegmentId: renderData.mainSegmentIndex,
                        context: mainContext
                    });
                    renderData.mainSegmentIndex++;
                }
                // Render the last segment to the secondary canvas
                if (renderData.mainSegmentIndex < segments.length) {
                    renderWormSegment({
                        renderTime,
                        wormId,
                        wormSegmentId: renderData.mainSegmentIndex,
                        context: secondaryContext
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
