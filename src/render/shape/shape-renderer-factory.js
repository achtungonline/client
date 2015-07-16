var ShapeRenderer = require("./shape-renderer.js");
var contourFunctions = require("./contour-functions.js");

module.exports = function ShapeRendererFactory() {

    var createContourFunctions = function () {
        var contourFunctionsMap = {};
        contourFunctionsMap["circle"] = contourFunctions.circle;
        contourFunctionsMap["rectangle"] = contourFunctions.rectangle;

        return contourFunctionsMap;
    };

    return {
        createShapeRenderer: function () {
            return ShapeRenderer(createContourFunctions())
        }
    };
};
