var gameStateFunctions = require("core/src/core/game-state-functions.js");

var WORM_HEAD_COLOR = "#FFB74D"; // 300 orange

module.exports = function WormHeadRenderer(options) {
    var playerConfigs = options.playerConfigs;
    var shapeRenderer = options.shapeRenderer;
    var canvas = options.canvas;
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
        context.lineWidth = size;
        context.beginPath();
        context.translate(x, y);
        context.rotate(direction - Math.PI/2);
        context.moveTo(0,2);
        context.lineTo(0,15);
        context.lineTo(-5,15);
        context.lineTo(0,25);
        context.lineTo(5,15);
        context.lineTo(0,15);
        context.closePath();
        context.fill();
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
                }
            }
        });
    }

    return {
        render: render
    };
};
