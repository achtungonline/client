module.exports = function ShapeRenderer(contourRenderers) {

    var render = function (options) {
        var canvasContext = options.canvasContext;
        var shape = options.shape;
        var fillColor = options.fillColor;
        var strokeColor = options.strokeColor;
        var strokeWidth = options.strokeWidth;

        var contourRenderer = contourRenderers[shape.type];
        contourRenderer(canvasContext, shape);

        if (fillColor !== undefined) {
            canvasContext.fillStyle = fillColor;
            canvasContext.fill();
        }

        if (strokeColor !== undefined) {
            canvasContext.strokeStyle = strokeColor;
            canvasContext.lineWidth = strokeWidth;
            canvasContext.stroke();
        }
    };

    return {
        render: render
    };
};