var playerUtils = require("core/src/core/player/player-utils.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");

var paper = require("paper");

module.exports = function PaperRenderer(options) {
    var gameState = options.gameState;
    var playerConfigs = options.playerConfigs;
    var canvas = options.canvas;

    var paperScope = paper.setup(canvas);
    var wormPaths = {};
    var newSegmentCount = {};

    function createPathStyle(gameState, wormSegment) {
        return {
            strokeWidth: wormSegment.size,
            strokeColor: playerConfigs.find(pc => pc.id === wormSegment.playerId).color.hexCode,
            strokeCap: "round",
            selected: true,
            opacity: wormSegment.jump ? 0 : 1
        };
    }

    function createNewPath(gameState, wormSegment, pathStyle) {
        pathStyle = pathStyle || createPathStyle(gameState, wormSegment);
        var path = new paperScope.Path(pathStyle);
        path.moveTo([wormSegment.startX, wormSegment.startY]);
        return path;
    }

    function moveWorm(gameState, worm) {
        var paths = wormPaths[worm.id];
        var currentTime = gameState.gameTime;
        var wormSegment = worm.pathSegments[worm.pathSegments.length - 1];
        var path = undefined;
        if (wormSegment.speed === 0) {
            return;
        }

        // Prepare path drawing
        if (paths.length === 0) {
            paths.push(createNewPath(gameState, wormSegment));
        } else {
            var path = paths[paths.length - 1];
            if (wormSegment.startTime < currentTime) {
                // Continue last segment
                path.removeSegments(path.segments.length - newSegmentCount[worm.id]);
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
            newSegmentCount[worm.id] = 1;
        } else {

            // Arc
            var halfAngle = wormSegment.arcStartAngle + wormSegment.arcAngleDiff/2;
            var halfPoint = [wormSegment.arcCenterX + wormSegment.arcRadius*Math.cos(halfAngle), wormSegment.arcCenterY + wormSegment.arcRadius*Math.sin(halfAngle)];
            var endPoint = [wormSegment.arcCenterX + wormSegment.arcRadius*Math.cos(wormSegment.arcEndAngle), wormSegment.arcCenterY + wormSegment.arcRadius*Math.sin(wormSegment.arcEndAngle)];

            var oldSegmentCount = path.segments.length;
            path.arcTo(halfPoint, endPoint);
            newSegmentCount[worm.id] = path.segments.length - oldSegmentCount;
        }
    }

    var render = function () {
        gameState.worms.forEach(function (worm) {
            if (wormPaths[worm.id] === undefined) {
                wormPaths[worm.id] = [];
            }
            moveWorm(gameState, worm);
        });
        paperScope.view.draw();
    };

    return {
        render: render
    };
};
