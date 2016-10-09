var ScaledCanvasContext = require("../scaled-canvas-context.js");

var PREVIEW_BLINK_DURATION = 2000;
var PREVIEW_FADE_LOW_POINT = 0.2;
var GREY_FILTER = "rgba(72, 72, 72, 0.21)";

module.exports = function GameOverlay() {

    var overlayState = {
        rendered: false,
        previewBlinkStartTime: undefined,
        gameCountdownEndTime: undefined,
        paused: false
    };

    function startPreviewBlink() {
        overlayState.previewBlinkStartTime = Date.now();
    }

    function endPreviewBlink() {
        overlayState.previewBlinkStartTime = undefined;
    }

    function startGameCountdown(countdown) {
        overlayState.gameCountdownEndTime = Date.now() + countdown;
    }

    function endGameCountdown() {
        overlayState.gameCountdownEndTime = undefined;
    }

    function setPaused(paused) {
        overlayState.paused = paused;
    }

    function reset() {
        endPreviewBlink();
        endGameCountdown();
    }

    function createRenderer({ canvas, gameState, scale=1 }) {
        var context = canvas.getContext("2d");
        var scaledContext = ScaledCanvasContext(context, scale);

        var render = function () {
            if (overlayState.rendered) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                overlayState.rendered = false;
            }
            if (overlayState.paused) {
                greyFilter();
                overlayState.rendered = true;
            }
            if (overlayState.previewBlinkStartTime !== undefined) {
                previewBlink();
                overlayState.rendered = true;
            }
            if (overlayState.gameCountdownEndTime !== undefined) {
                gameCountdown();
                overlayState.rendered = true;
            }
        };

        function greyFilter() {
            context.fillStyle = GREY_FILTER;
            var shape = gameState.map.shape;
            if (shape.type === "rectangle") {
                scaledContext.fillRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                context.beginPath();
                scaledContext.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                context.fill();
            }
        }

        function gameCountdown() {
            context.save();
            var timeLeft = Math.ceil(Math.max(0, overlayState.gameCountdownEndTime - Date.now())/1000);
            var fontSize = Math.max(canvas.width, canvas.height) / 25;
            context.font = fontSize + "px bungee";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.fillText("Next game starts in: " + timeLeft, canvas.width / 2, (canvas.height + fontSize) / 2);
            context.restore();
        }

        function previewBlink() {
            context.save();
            var timeDiff = (Date.now() - overlayState.previewBlinkStartTime) % PREVIEW_BLINK_DURATION;
            var a = timeDiff / PREVIEW_BLINK_DURATION * Math.PI;
            var fontSize = Math.max(canvas.width, canvas.height) / 25;
            var offsetX = 19/20*canvas.width, offsetY = 1/20*canvas.height;
            if (gameState.map.shape.type === "circle") {
                offsetX = 99/100*canvas.width;
                offsetY = 1/50*canvas.height;
            }
            offsetY += fontSize;

            context.globalAlpha = PREVIEW_FADE_LOW_POINT + Math.sin(a) * (1 - PREVIEW_FADE_LOW_POINT);
            context.font = fontSize + "px bungee";
            context.fillStyle = "black";
            context.textAlign = "right";
            context.fillText("Preview", offsetX, offsetY);
            context.restore();
        }

        return {
            render: render
        };
    }

    return {
        endGameCountdown,
        endPreviewBlink,
        createRenderer,
        reset,
        setPaused,
        startGameCountdown,
        startPreviewBlink
    }
};
