var MAP_BACKGROUND_COLOR = "#faf7ed";
var MAP_BORDER_COLOR = "black";

module.exports = function MapRenderer({ gameState, canvas, borderWidth }) {

    borderWidth = borderWidth || 0;
    var context = canvas.getContext("2d");
    var rendered = false;

    var render = function (renderTime) {
        if (rendered) {
            return;
        }

        var shape = gameState.map.shape;
        if (shape.type === "rectangle") {
            if (borderWidth > 0) {
                context.fillStyle = MAP_BORDER_COLOR;
                context.beginPath();
                context.rect(shape.x, shape.y, shape.width + borderWidth*2, shape.height + borderWidth*2);
                context.fill();
            }
            context.fillStyle = MAP_BACKGROUND_COLOR;
            context.beginPath();
            context.rect(shape.x + borderWidth, shape.y + borderWidth, shape.width, shape.height);
            context.fill();
        } else if (shape.type === "circle") {
            if (borderWidth > 0) {
                context.fillStyle = MAP_BORDER_COLOR;
                context.beginPath();
                context.arc(shape.centerX + borderWidth, shape.centerY + borderWidth, shape.radius + borderWidth, 0, 2 * Math.PI);
                context.fill();
            }
            context.fillStyle = MAP_BACKGROUND_COLOR;
            context.beginPath();
            context.arc(shape.centerX + borderWidth, shape.centerY + borderWidth, shape.radius, 0, 2 * Math.PI);
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
