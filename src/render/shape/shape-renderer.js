module.exports = function ShapeRenderer(contourFunctionsMap) {

    var render = function (canvasContext, shape, fillColor, strokeColor) {
        var contourFunction = contourFunctionsMap[shape.type];
        contourFunction(canvasContext, shape);

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