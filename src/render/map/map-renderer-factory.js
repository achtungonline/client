var ShapeRendererFactory = require("../shape/shape-renderer-factory.js");
var MapRenderer = require("./map-renderer.js");

module.exports = function MapRendererFactory() {
    return {
        createMapRenderer: function () {
            return MapRenderer(ShapeRendererFactory().createShapeRenderer())
        }
    };
};
