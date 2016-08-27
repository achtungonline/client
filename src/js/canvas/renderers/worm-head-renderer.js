var forEach = require("core/src/core/util/for-each.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");
var trajectoryUtil = require("core/src/core/geometry/trajectory/trajectory-util.js");

var WORM_HEAD_COLOR = "#FFB74D"; // 300 orange

module.exports = function WormHeadRenderer({ gameState, players, canvas, drawTrajectories }) {
    var context = canvas.getContext("2d");
    var wormRenderData = {};
    var prevRenderTime = 0;

    function getWormRenderData(wormId) {
        if (wormRenderData[wormId] === undefined) {
            wormRenderData[wormId] = {
                segmentIndex: 0
            };
        }
        return wormRenderData[wormId];
    }

    function clearRenderData() {
        forEach(wormRenderData, function(renderData) {
            renderData.segmentIndex = 0;
        });
    }

    function drawHead(x, y, size) {
        context.fillStyle = WORM_HEAD_COLOR;
        context.beginPath();
        context.arc(x, y, size / 2 + 1, 0, 2 * Math.PI);
        context.fill();
    }

    function drawArrow(x, y, direction, size, color) {
        context.save();
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = 4;
        context.beginPath();
        context.translate(x, y);
        context.rotate(direction - Math.PI / 2);

        var arrowBaseEndpoint = 25;
        var arrowHeadEndpoint = 30;
        var arrowHeadWidth = 3;

        context.moveTo(0, 0);
        context.lineTo(0, arrowBaseEndpoint);
        context.lineTo(-arrowHeadWidth, arrowBaseEndpoint);
        context.lineTo(0, arrowHeadEndpoint);
        context.lineTo(arrowHeadWidth, arrowBaseEndpoint);
        context.lineTo(0, arrowBaseEndpoint);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }

    function drawTrajectory(worm, color) {
        if(!worm.trajectory) {
            return;
        }
        context.save();
        context.strokeStyle = color;
        context.setLineDash([2,5]);
        context.lineWidth = 2;
        context.beginPath();
        context.translate(worm.head.centerX, worm.head.centerY);
        context.rotate(worm.direction - Math.PI/2);
        worm.trajectory.forEach(function (move) {
            var turnRadius;
            if (move.turningVelocity !== 0) {
                turnRadius = Math.abs(move.speed / move.turningVelocity);
            }
            context.moveTo(0, 0);
            var distanceTravelled = move.speed * move.duration;
            var angleTurned = move.turningVelocity * move.duration;
            if (move.turningVelocity < 0) {
                context.arc(turnRadius, 0, turnRadius, Math.PI, Math.PI + angleTurned, true);
                context.translate(-turnRadius*(Math.cos(angleTurned) -  1), -turnRadius*Math.sin(angleTurned));
                context.rotate(angleTurned);
            } else if (move.turningVelocity > 0) {
                context.arc(-turnRadius, 0, turnRadius, 0, angleTurned);
                context.translate(turnRadius*(Math.cos(angleTurned) - 1), turnRadius*Math.sin(angleTurned));
                context.rotate(angleTurned);
            } else {
                context.lineTo(0, distanceTravelled);
                context.translate(0, distanceTravelled);
            }
        });
        context.stroke();
        context.restore();
    }

    function render(renderTime) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (renderTime < prevRenderTime) {
            clearRenderData();
        }

        forEach(gameState.wormPathSegments, function (segments, wormId) {
            var renderData = getWormRenderData(wormId);
            while (renderData.segmentIndex < segments.length - 1 && segments[renderData.segmentIndex + 1].startTime < renderTime) {
                renderData.segmentIndex++;
            }
            if (segments.length > 0) {
                var segment = segments[renderData.segmentIndex];
                if (segment.type !== "clear") {
                    var position = trajectoryUtil.followTrajectory(segment, renderTime - segment.startTime);
                    var size = segment.size;
                    var color = players.find(p => p.id === segment.playerId).color.hexCode;
                    if (segment.type === "still_arc") {
                        drawArrow(position.x, position.y, position.direction, size, color);
                    } else if(drawTrajectories && gameState.worms) {
                        drawTrajectory(gameStateFunctions.getWorm(gameState, wormId), color);
                    }
                    drawHead(position.x, position.y, size, color);

                }
            }
        });

        prevRenderTime = renderTime;
    }

    return {
        render: render
    };
};
