var ShapeRenderer = require("./shape-renderer.js");

var renderers = [
    require("./circle-renderer.js"),
    require("./rectangle-renderer.js")
];

var createRenderersFunctionMap = function (fn) {
    var map = {};

    renderers.forEach(function addRendererToMap(renderer) {
        map[renderer.type] = renderer[fn];
    });

    return map;
};

var contourRendererFunctions = createRenderersFunctionMap("renderContour");

module.exports = function ShapeRendererFactory() {
    return {
        create: function () {
            return ShapeRenderer(contourRendererFunctions);
        }
    };
};
