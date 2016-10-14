import forEach from "core/src/core/util/for-each.js";
import * as gsf from "core/src/core/game-state-functions.js";
import * as trajectoryUtil from "core/src/core/geometry/trajectory/trajectory-util.js";
import {wormColors} from "core/src/core/constants.js";

import ScaledCanvasContext from "../scaled-canvas-context.js";

var HEAD_COLOR = "#FFB74D"; // 300 orange
var KEY_SWITCH_HEAD_COLOR = "#3388BB";

var blinkingStartTime = Date.now() / 1000;

export default function WormHeadRenderer({ gameState, players, canvas, drawTrajectories, scale=1 }) {
    var context = canvas.getContext("2d");
    var scaledContext = ScaledCanvasContext(context, scale);
    var wormRenderData = {};
    var activeEffects = [];
    var prevRenderTime = 0;
    var effectEventIndex = 0;

    function getSegmentRenderData(wormId) {
        if (wormRenderData[wormId] === undefined) {
            wormRenderData[wormId] = {
                segmentIndex: 0,
                latestClearSegmentIndex: 0
            };
        }
        return wormRenderData[wormId];
    }

    function clearRenderData() {
        forEach(wormRenderData, function (renderData) {
            renderData.segmentIndex = 0;
            renderData.latestClearSegmentIndex = 0;
        });
        effectEventIndex = 0;
        activeEffects = [];
    }

    function updateEffectData(renderTime) {
        var effectEvents = gameState.effectEvents;
        while (effectEventIndex < effectEvents.length && effectEvents[effectEventIndex].time <= renderTime) {
            var effectEvent = effectEvents[effectEventIndex];
            effectEventIndex++;
            if (effectEvent.type === "spawn") {
                activeEffects.push(effectEvent.effect);
            } else if (effectEvent.type === "despawn") {
                var effect = activeEffects.splice(activeEffects.findIndex(effect => effect.id === effectEvent.id), 1);
            } else {
                throw Error("Unknown effect event type: " + effectEvent.type);
            }
        }
    }

    function drawHead({ x, y, direction, size, headColor, headShape, blinking}) {
        context.save();
        if (blinking) {
            var BLINK_DURATION = 1;
            var FADE_LOW_POINT = 0;
            var timeDiff = (Date.now() / 1000 - blinkingStartTime) % BLINK_DURATION;
            var a = timeDiff / BLINK_DURATION * Math.PI;
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
        if (renderTime === prevRenderTime) {
            return;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (renderTime < prevRenderTime) {
            clearRenderData();
        }
        updateEffectData(renderTime);


        forEach(gameState.wormPathSegments, function (segments, segmentId) {
            var renderData = getSegmentRenderData(segmentId);
            //TODO, the list will always maxiumum contain 1 element, so this code is stupid

            var wormHeadSegments = segments.filter(function (segment, index) {
                // Segments where a worm seemed to have died
                return segment.type === "worm_died" && segment.startTime < renderTime && index > renderData.latestClearSegmentIndex;
            });

            while (renderData.segmentIndex < segments.length - 1 && segments[renderData.segmentIndex + 1].startTime < renderTime) {
                if (segments[renderData.segmentIndex + 1].type === "clear") {
                    renderData.latestClearSegmentIndex = [renderData.segmentIndex + 1];
                }
                renderData.segmentIndex++;
            }
            if (segments[renderData.segmentIndex].startTime <= renderTime && segments[renderData.segmentIndex].endTime >= renderTime) {
                wormHeadSegments.push(segments[renderData.segmentIndex]);
            }

            wormHeadSegments.forEach(function (segment) {
                var position = trajectoryUtil.followTrajectory(segment, renderTime - segment.startTime);
                var size = segment.size;
                var playerColor = wormColors[players.find(p => p.id === segment.playerId).colorId];
                var headColor = HEAD_COLOR;
                var headShape = "circle";
                var blinking = false;
                activeEffects.forEach(function (effect) {
                    if (effect.wormId === segmentId) {
                        if (effect.name === "key_switch") {
                            headColor = KEY_SWITCH_HEAD_COLOR;
                        } else if (effect.name === "tron_turn") {
                            headShape = "square";
                        } else if (effect.name === "wall_hack") {
                            blinking = true;
                        }
                    }
                });

                if (segment.type === "still_arc") {
                    drawArrow(position.x, position.y, position.direction, size, playerColor);
                } else if (drawTrajectories) {
                    drawTrajectory(gameState, segment);
                }
                drawHead({
                    x: position.x,
                    y: position.y,
                    direction: position.direction,
                    size,
                    headColor,
                    headShape,
                    blinking
                });
            });

        });

        prevRenderTime = renderTime;
    }

    return {
        render: render
    };
};
