var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRendererFactory = require("./map/map-renderer-factory.js");
var RenderHandler = require("./render-handler.js");

module.exports = function RenderFactory() {
    return {
        createRenderHandler: function (canvasContext) {
            return RenderHandler(canvasContext, ShapeRendererFactory().createShapeRenderer(), MapRendererFactory().createMapRenderer());
        }
    };
};
