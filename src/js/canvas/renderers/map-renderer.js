import ScaledCanvasContext from "../scaled-canvas-context.js";

var MAP_BACKGROUND_COLOR = "#faf7ed";
var MAP_BORDER_COLOR = "black";
var START_PHASE_COUNT_DOWN_COLOR = "#dddddd"

export default function MapRenderer({ gameState, canvas, borderCanvas, scale=1 }) {

    var context = canvas.getContext("2d");
    var scaledContext = ScaledCanvasContext(context, scale);
    var borderContext = borderCanvas.getContext("2d");
    var scaledBorderContext = ScaledCanvasContext(borderContext, scale);

    var prevRenderTime = 0;
    var gameEventIndex = 0;
    var startPhaseEvent = null;
    var startPhaseTimer = -1;
    var borderRendered = false;

    function renderBorder() {
        var borderWidth = gameState.map.borderWidth;
        var shape = gameState.map.shape;
        if (shape.type === "rectangle") {
            if (borderWidth > 0) {
                borderContext.fillStyle = MAP_BORDER_COLOR;
                borderContext.beginPath();
                scaledBorderContext.rect(shape.x - borderWidth, shape.y - borderWidth, shape.width + 2*borderWidth, shape.height + 2*borderWidth);
                borderContext.fill();
                scaledBorderContext.clearRect(shape.x, shape.y, shape.width, shape.height);
            }
        } else if (shape.type === "circle") {
            if (borderWidth > 0) {
                borderContext.fillStyle = MAP_BORDER_COLOR;
                borderContext.beginPath();
                scaledBorderContext.arc(shape.centerX, shape.centerY, shape.radius + borderWidth, 0, 2 * Math.PI);
                borderContext.fill();

                borderContext.globalCompositeOperation = "destination-out";
                borderContext.beginPath();
                scaledBorderContext.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                borderContext.fill();
                borderContext.globalCompositeOperation = "source-over";
            }
        } else {
            throw Error("Unknown shape: " + shape.type);
        }
    }

    function renderBackground() {
        var shape = gameState.map.shape;
        if (shape.type === "rectangle") {
            context.fillStyle = MAP_BACKGROUND_COLOR;
            context.beginPath();
            scaledContext.rect(shape.x, shape.y, shape.width, shape.height);
            context.fill();
        } else if (shape.type === "circle") {
            context.fillStyle = MAP_BACKGROUND_COLOR;
            context.beginPath();
            scaledContext.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            context.fill();
        } else {
            throw Error("Unknown shape: " + shape.type);
        }

        if (startPhaseTimer > 0) {
            var fontSize = canvas.height / 3;
            context.font = fontSize + "px bungee";
            context.fillStyle = START_PHASE_COUNT_DOWN_COLOR;
            context.textAlign = "center";
            context.fillText(startPhaseTimer + "", canvas.width / 2, (canvas.height + fontSize - 30) / 2);
        }
    }

    function render(renderTime) {
        if (renderTime < prevRenderTime) {
            gameEventIndex = 0;
            startPhaseEvent = null;
        }
        while (gameEventIndex < gameState.gameEvents.length && gameState.gameEvents[gameEventIndex].time <= renderTime) {
            if (gameState.gameEvents[gameEventIndex].type === "start_phase") {
                startPhaseEvent = gameState.gameEvents[gameEventIndex];
            }
            gameEventIndex++;
        }

        var newStartPhaseTimer = 0;
        if (startPhaseEvent) {
            newStartPhaseTimer = Math.ceil(Math.max(0, startPhaseEvent.time + startPhaseEvent.duration - renderTime));
        }
        if (newStartPhaseTimer !== startPhaseTimer) {
            startPhaseTimer = newStartPhaseTimer;
            renderBackground();
        }
        if (!borderRendered) {
            renderBorder();
            borderRendered = true;
        }
        prevRenderTime = renderTime;
    };

    return {
        render: render
    };
};
