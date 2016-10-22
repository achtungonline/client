import forEach from "core/src/core/util/for-each.js";
import * as gsf from "core/src/core/game-state-functions.js";
import * as csf from "../canvas-state-functions.js";
import * as trajectoryUtil from "core/src/core/geometry/trajectory/trajectory-util.js";
import {wormColors} from "core/src/core/constants.js";

import ScaledCanvasContext from "../scaled-canvas-context.js";

var HEAD_COLOR = "#FFB74D"; // 300 orange
var KEY_SWITCH_HEAD_COLOR = "#3388BB";

var bubbleImageElement = document.createElement("img");
bubbleImageElement.src = "svg/bubble.svg";

export default function WormHeadRenderer({ gameState, canvasState, players, canvas, drawTrajectories, scale=1 }) {
    var context = canvas.getContext("2d");
    var scaledContext = ScaledCanvasContext(context, scale);

    function drawHead({ x, y, direction, size, headColor, headShape, blinkingStartTime, renderTime}) {
        context.save();

        if (blinkingStartTime || blinkingStartTime === 0) {
            var BLINK_DURATION = 2;
            var FADE_LOW_POINT = 0;
            var timeDiff = (renderTime - (blinkingStartTime - BLINK_DURATION/2)) % BLINK_DURATION;
            var a = (timeDiff / BLINK_DURATION) * Math.PI;
            context.globalAlpha = FADE_LOW_POINT + Math.sin(a) * (1 - FADE_LOW_POINT);
        }

        context.fillStyle = headColor;
        if (headShape === "circle") {
            context.beginPath();
            scaledContext.arc(x, y, size + 1, 0, 2 * Math.PI);
            context.fill();
        } else if (headShape === "square") {
            scaledContext.translate(x, y);
            context.rotate(direction - Math.PI / 2);
            scaledContext.fillRect(-size - 0.5, -size - 0.5, size * 2 + 1, size * 2 + 1);
        } else {
            throw Error("Unknown head shape: " + headShape);
        }
        context.restore();
    }

    function drawDrunkBubbles({color, renderTime, segmentId, wormId}) {
        context.save();
        context.fillStyle = color;
        context.globalAlpha = 0.3;

        csf.getDrunkBubbles(gameState, renderTime, segmentId, wormId).forEach(function(bubble) {
            var x = bubble.x;
            var y = bubble.y;
            var radius = bubble.radius;
            context.beginPath();
            scaledContext.arc(x, y, radius, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            scaledContext.drawImage(bubbleImageElement, x - radius, x - radius, radius * 2, radius * 2);
        });

        context.restore();
    }

    function drawArrow(x, y, direction, size, color) {
        context.save();
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = scale * 4;
        context.beginPath();
        scaledContext.translate(x, y);
        context.rotate(direction - Math.PI / 2);

        var arrowBaseEndpoint = 25;
        var arrowHeadEndpoint = 30;
        var arrowHeadWidth = 4;

        scaledContext.moveTo(0, 0);
        scaledContext.lineTo(0, arrowBaseEndpoint);
        scaledContext.lineTo(-arrowHeadWidth, arrowBaseEndpoint);
        scaledContext.lineTo(0, arrowHeadEndpoint);
        scaledContext.lineTo(arrowHeadWidth, arrowBaseEndpoint);
        scaledContext.lineTo(0, arrowBaseEndpoint);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }

    function drawTrajectory(gameState, segment) {
        var player = gsf.getPlayer(gameState, segment.playerId);
        if (!player.aiData || !player.aiData.trajectory) {
            return;
        }
        var color = wormColors[players.find(p => p.id === segment.playerId).colorId];
        context.save();
        context.beginPath();
        scaledContext.translate(segment.endX, segment.endY);
        context.rotate(segment.endDirection - Math.PI / 2);
        context.strokeStyle = color;
        context.setLineDash([scale * 2, scale * 5]);
        context.lineWidth = scale * 2;
        player.aiData.trajectory.forEach(function (move) {
            var turnRadius;
            if (move.turningVelocity !== 0) {
                turnRadius = Math.abs(move.speed / move.turningVelocity);
            }
            scaledContext.moveTo(0, 0);
            var distanceTravelled = move.speed * move.duration;
            var angleTurned = move.turningVelocity * move.duration;
            if (move.turningVelocity < 0) {
                scaledContext.arc(turnRadius, 0, turnRadius, Math.PI, Math.PI + angleTurned, true);
                scaledContext.translate(-turnRadius * (Math.cos(angleTurned) - 1), -turnRadius * Math.sin(angleTurned));
                context.rotate(angleTurned);
            } else if (move.turningVelocity > 0) {
                scaledContext.arc(-turnRadius, 0, turnRadius, 0, angleTurned);
                scaledContext.translate(turnRadius * (Math.cos(angleTurned) - 1), turnRadius * Math.sin(angleTurned));
                context.rotate(angleTurned);
            } else {
                scaledContext.lineTo(0, distanceTravelled);
                scaledContext.translate(0, distanceTravelled);
            }
        });
        context.stroke();
        context.restore();
    }

    function render(renderTime) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (renderTime < canvasState.prevRenderTime) {
            csf.clearPathSegmentRenderData(canvasState);
        }

        forEach(gameState.wormPathSegments, function (segments, segmentId) {
            var renderData = csf.getPathSegmentRenderData(canvasState, segmentId);

            while (renderData.segmentIndex < segments.length - 1 && segments[renderData.segmentIndex + 1].startTime < renderTime) {
                if (segments[renderData.segmentIndex + 1].type === "clear") {
                    renderData.latestClearSegmentIndex = [renderData.segmentIndex + 1];
                }
                renderData.segmentIndex++;
            }

            var wormHeadSegment;
            if (segments[renderData.segmentIndex].startTime <= renderTime && segments[renderData.segmentIndex].endTime >= renderTime) {
                wormHeadSegment = segments[renderData.segmentIndex];
            } else {
                wormHeadSegment = segments.find(function (segment, index) {
                    // Segments where a worm seemed to have died
                    return segment.type === "worm_died" && segment.startTime < renderTime && index > renderData.latestClearSegmentIndex;
                });
            }

            var playerColor = wormColors[players.find(p => p.id === segments[0].playerId).colorId];

            drawDrunkBubbles({
                color: playerColor,
                renderTime,
                segmentId,
                wormId: segments[0].wormId
            });

            if(wormHeadSegment) {
                var position = trajectoryUtil.followTrajectory(wormHeadSegment, renderTime - wormHeadSegment.startTime);
                var size = wormHeadSegment.size;
                var headColor = HEAD_COLOR;
                var headShape = "circle";
                csf.getActiveEffects(gameState, renderTime, {wormId: wormHeadSegment.wormId}).forEach(function (effect) {
                    if (effect.name === "key_switch") {
                        headColor = KEY_SWITCH_HEAD_COLOR;
                    } else if (effect.name === "tron_turn") {
                        headShape = "square";
                    }
                });

                if (wormHeadSegment.type === "still_arc") {
                    drawArrow(position.x, position.y, position.direction, size, playerColor);
                } else if (drawTrajectories) {
                    drawTrajectory(gameState, wormHeadSegment);
                }
                drawHead({
                    x: position.x,
                    y: position.y,
                    direction: position.direction,
                    size,
                    headColor,
                    headShape,
                    blinkingStartTime: csf.getWormBlinkingStartTime(gameState, wormHeadSegment.wormId, renderTime),
                    renderTime
                });


            }


        });
    }

    return {
        render: render
    };
};
