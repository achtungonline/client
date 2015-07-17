var ShapeRenderer = require("./shape-renderer.js");

var renderers = [
    require("./circle-renderer.js"),
    require("./rectangle-renderer.js")
];

module.exports = function ShapeRendererFactory() {

    var createRenderersFunctionMap = function (fn) {
        var map = {};

        renderers.forEach(function addRendererToMap(renderer) {
            map[renderer.type] = renderer[fn];
        });

        return map;
    };

    var contourRendererFunctions = createRenderersFunctionMap("renderContour");

    return {
        createShapeRenderer: function () {
            return ShapeRenderer(contourRendererFunctions)
        }
    };
};
