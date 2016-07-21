var gameStateFunctions = require("core/src/core/game-state-functions.js");

var WORM_HEAD_COLOR = "#FFB74D"; // 300 orange

module.exports = function WormHeadRenderer(options) {
    var playerConfigs = options.playerConfigs;
    var shapeRenderer = options.shapeRenderer;
    var canvas = options.canvas;
    var drawTrajectories = options.drawTrajectories;
    var context = canvas.getContext("2d");

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
            if (move.turningSpeed !== 0) {
                turnRadius = Math.abs(move.speed / move.turningSpeed);
            }
            context.moveTo(0, 0);
            var distanceTravelled = move.speed * move.duration;
            var angleTurned = move.turningSpeed * move.duration;
            if (move.turningSpeed < 0) {
                context.arc(turnRadius, 0, turnRadius, Math.PI, Math.PI + angleTurned, true);
                context.translate(-turnRadius*(Math.cos(angleTurned) -  1), -turnRadius*Math.sin(angleTurned));
                context.rotate(angleTurned);
            } else if (move.turningSpeed > 0) {
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

    function render(gameState, renderStartTime, renderEndTime) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        gameState.worms.forEach(function (worm) {
            if (gameStateFunctions.isPlayerAlive(gameState, worm.playerId)) {
                var segments = worm.pathSegments;
                if (segments.length > 0) {
                    var segment = segments[segments.length - 1];
                    var x = segment.endX;
                    var y = segment.endY;
                    var direction = segment.endDirection;
                    var size = segment.size;
                    var color = playerConfigs.find(pc => pc.id === segment.playerId).color.hexCode;
                    if (gameState.phase === "startPhase") {
                        drawArrow(x, y, direction, size, color);
                    }
                    drawHead(x, y, size, color);
                    if(drawTrajectories) {
                        drawTrajectory(worm, color);
                    }
                }
            }
        });
    }

    return {
        render: render
    };
};
