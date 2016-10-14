import ScaledCanvasContext from "../scaled-canvas-context.js";

var MAP_BACKGROUND_COLOR = "#faf7ed";
var MAP_BORDER_COLOR = "black";

export default function MapRenderer({ gameState, canvas, borderCanvas, scale=1 }) {

    var context = canvas.getContext("2d");
    var scaledContext = ScaledCanvasContext(context, scale);
    var borderContext = borderCanvas.getContext("2d");
    var scaledBorderContext = ScaledCanvasContext(borderContext, scale);
    var rendered = false;

    var render = function (renderTime) {
        if (rendered) {
            return;
        }

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
            context.fillStyle = MAP_BACKGROUND_COLOR;
            context.beginPath();
            scaledContext.rect(shape.x, shape.y, shape.width, shape.height);
            context.fill();
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
            context.fillStyle = MAP_BACKGROUND_COLOR;
            context.beginPath();
            scaledContext.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            context.fill();
        } else {
            throw Error("Unknown shape: " + shape.type);
        }

        rendered = true;
    };

    return {
        render: render
    };
};
