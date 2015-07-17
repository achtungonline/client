module.exports = function ShapeRenderer(contourRenderers) {

    var render = function (canvasContext, shape, fillColor, strokeColor) {
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
    }
};