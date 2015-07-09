var shapeRenderer = module.exports = {};

shapeRenderer.createRenderLogicMap = function () {
    var renderLogicMap = {};
    renderLogicMap["circle"] = function (canvasContext, circle) {
        canvasContext.beginPath();
        canvasContext.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
    };

    renderLogicMap["rectangle"] = function (canvasContext, rectangle) {
        canvasContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    };

    return renderLogicMap;
};

shapeRenderer.renderShape = function (shapeRenderLogicMap, canvasContext, shape, fillColor, strokeColor) {

    var shapeRenderLogic = shapeRenderLogicMap[shape.type];
    shapeRenderLogic(canvasContext, shape);


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