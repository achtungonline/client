var contourFunctions = module.exports = {};
contourFunctions.circle = function (canvasContext, circle) {
    canvasContext.beginPath();
    canvasContext.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI)
};

contourFunctions.rectangle = function (canvasContext, rectangle) {
    canvasContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};

