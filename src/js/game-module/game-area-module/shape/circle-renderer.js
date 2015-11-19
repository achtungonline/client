var circleShape = require("core/src/core/geometry/shape/circle.js");

var renderer = module.exports = {};

renderer.type = circleShape.type;

renderer.renderContour = function (canvasContext, circle) {
    canvasContext.beginPath();
    canvasContext.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
};
