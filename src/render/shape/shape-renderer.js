module.exports = function ShapeRenderer(canvasContext, contourRenderers) {

    var render = function (shape, fillColor, strokeColor) {
        var contourRenderer = contourRenderers[shape.type];
        contourRenderer(canvasContext, shape);

        if (fillColor !== undefined) {
            canvasContext.fillStyle = fillColor;
            canvasContext.fill();
        }

        if (strokeColor !== undefined) {
            canvasContext.strokeStyle = strokeColor;
            //canvasContext.lineWidth = 5;
            canvasContext.stroke();
        }
    };

    return {
        render: render
    };
};