var rectangleType = require("core/src/core/geometry/shape/rectangle.js").type;
var circleType = require("core/src/core/geometry/shape/circle.js").type;

module.exports = function ShapeRenderer() {

    var render = function (options) {
        var canvasContext = options.canvasContext;
        var shape = options.shape;
        var fillColor = options.fillColor;
        var borderWidth = options.borderWidth || 0;
        var borderColor = options.borderColor || "black";

        if (shape.type === rectangleType) {
            if (borderWidth > 0) {
                canvasContext.fillStyle = borderColor;
                canvasContext.beginPath();
                canvasContext.rect(shape.x, shape.y, shape.width + borderWidth*2, shape.height + borderWidth*2);
                canvasContext.fill();
            }
            canvasContext.fillStyle = fillColor;
            canvasContext.beginPath();
            canvasContext.rect(shape.x + borderWidth, shape.y + borderWidth, shape.width, shape.height);
            canvasContext.fill();
        } else if (shape.type === circleType) {
            if (borderWidth > 0) {
                canvasContext.fillStyle = borderColor;
                canvasContext.beginPath();
                canvasContext.arc(shape.centerX + borderWidth, shape.centerY + borderWidth, shape.radius + borderWidth, 0, 2 * Math.PI);
                canvasContext.fill();
            }
            canvasContext.fillStyle = fillColor;
            canvasContext.beginPath();
            canvasContext.arc(shape.centerX + borderWidth, shape.centerY + borderWidth, shape.radius, 0, 2 * Math.PI);
            canvasContext.fill();
        } else {
            throw Error("Unknown shape: " + shape.type);
        }
    };

    return {
        render: render
    };
};
