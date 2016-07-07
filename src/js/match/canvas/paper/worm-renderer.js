var Animator = require("./animator.js");

var forEach = require("core/src/core/util/for-each.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");
var PlayerUtils = require("core/src/core/player/player-utils.js");

module.exports = function WormRenderer(paperScope, playerConfigs) {
    var wormBodyLayer = new paperScope.Layer();
    var wormHeadLayer = new paperScope.Layer();
    var animator = Animator();

    var wormsRenderingData = {};
    var newSegmentCount = {};

    function createPathStyle(gameState, wormSegment) {
        return {
            strokeWidth: wormSegment.size,
            strokeColor: playerConfigs.find(pc => pc.id === wormSegment.playerId).color.hexCode,
            strokeCap: "round",
            selected: false,
            opacity: wormSegment.jump ? 0 : 1
        };
    }

    function createNewPath(gameState, wormSegment, pathStyle) {
        pathStyle = pathStyle || createPathStyle(gameState, wormSegment);
        var path = new paperScope.Path(pathStyle);
        path.moveTo([wormSegment.startX, wormSegment.startY]);
        return path;
    }

    function createWormHead(worm) {
        wormHeadLayer.activate();
        var circle = new paperScope.Shape.Circle([worm.head.centerX, worm.head.centerY], worm.size / 2 + 1);
        circle.fillColor = "#FF9800";
        wormBodyLayer.activate();
        return circle;
    }

    function createWormArrow(worm) {
        wormHeadLayer.activate();
        var arrow = new paperScope.Path();
        arrow.add([0, 2]);
        arrow.add([0, 15]);
        arrow.add([-5, 15]);
        arrow.add([0, 25]);
        arrow.add([5, 15]);
        arrow.add([0, 15]);
        arrow.closed = true;
        arrow.applyMatrix = false;
        arrow.pivot = [0, 0];
        wormBodyLayer.activate();
        return arrow;
    }

    function renderWormSegment(gameState, wormId, wormSegmentIndex) {
        var worm = gameStateFunctions.getWorm(gameState, wormId);
        var paths = wormsRenderingData[wormId].paths;
        var wormSegment = worm.pathSegments[wormSegmentIndex];
        var currentTime = gameState.gameTime;
        if (wormSegment === undefined || currentTime > wormSegment.startTime + wormSegment.duration) {
            return;
        }

        var path;
        // Prepare path drawing
        if (paths.length === 0) {
            paths.push(createNewPath(gameState, wormSegment));
        } else {
            var path = paths[paths.length - 1];
            if (wormSegment.startTime < currentTime) {
                // Continue last segment
                path.removeSegments(path.segments.length - newSegmentCount[wormId]);
            } else {
                var pathStyle = createPathStyle(gameState, wormSegment);
                if (pathStyle.strokeWidth !== path.strokeWidth ||
                    pathStyle.strokeColor !== path.strokeColor ||
                    pathStyle.opacity !== path.opacity) {
                    paths.push(createNewPath(gameState, wormSegment, pathStyle));
                }
            }
        }
        path = paths[paths.length - 1];

        // Draw path
        if (wormSegment.type === "straight") {
            path.add([wormSegment.endX, wormSegment.endY]);
            newSegmentCount[wormId] = 1;
        } else {
            // Arc
            if (wormSegment.speed > 0) {
                var halfAngle = wormSegment.arcStartAngle + wormSegment.arcAngleDiff / 2;
                var halfPoint = [wormSegment.arcCenterX + wormSegment.arcRadius * Math.cos(halfAngle), wormSegment.arcCenterY + wormSegment.arcRadius * Math.sin(halfAngle)];
                var endPoint = [wormSegment.arcCenterX + wormSegment.arcRadius * Math.cos(wormSegment.arcEndAngle), wormSegment.arcCenterY + wormSegment.arcRadius * Math.sin(wormSegment.arcEndAngle)];

                var oldSegmentCount = path.segments.length;
                path.arcTo(halfPoint, endPoint);
                newSegmentCount[wormId] = path.segments.length - oldSegmentCount;
            } else {
                newSegmentCount[wormId] = 0;
            }
        }

        // Update head
        var wormHead = wormsRenderingData[wormId].head;
        wormHead.position = [wormSegment.endX, wormSegment.endY];
        wormHead.radius = wormSegment.size / 2 + 1;
        // Update arrow
        var wormArrow = wormsRenderingData[wormId].arrow;
        wormArrow.style = path.style;
        wormArrow.fillColor = wormArrow.strokeColor;
        wormArrow.position = [wormSegment.endX, wormSegment.endY];
        wormArrow.rotation = wormSegment.endDirection * 180 / Math.PI - 90;
        if (gameState.phase === "startPhase") {
            wormArrow.visible = true;
        } else {
            wormArrow.visible = false;
        }
    }

    function clearWorms(gameState) {
        var removedItems = [];
        forEach(wormsRenderingData, function (worm, wormId) {
            worm.paths.forEach(function (path) {
                removedItems.push(path);
            });
            worm.paths = [];

            // Remove dead heads
            var playerId = PlayerUtils.getWormById(gameState.worms, parseInt(wormId)).playerId;
            if (!gameStateFunctions.isPlayerAlive(gameState, playerId)) {
                removedItems.push(worm.head);
            }
        });

        removedItems.forEach(function (item) {
            animator.startAnimation(gameState, {
                item: item,
                property: "opacity",
                change: -item.opacity,
                duration: 0.3,
                endCallback: function () {
                    item.remove();
                }
            });
        });
    }

    function update(gameState) {
        wormBodyLayer.activate();
        animator.update(gameState);
        gameState.worms.forEach(function (worm) {
            if (wormsRenderingData[worm.id] === undefined) {
                wormsRenderingData[worm.id] = {
                    head: createWormHead(worm),
                    arrow: createWormArrow(worm),
                    paths: []
                };
            }
            renderWormSegment(gameState, worm.id, worm.pathSegments.length - 1);
        });
    }

    return {
        clearWorms: clearWorms,
        update: update
    };
}
