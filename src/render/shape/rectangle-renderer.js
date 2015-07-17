var rectangleShape = require("core/src/geometry/shape/rectangle.js");

var renderer = module.exports = {};

renderer.type = rectangleShape.type;

renderer.renderContour = function (canvasContext, rectangle) {
    canvasContext.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};
