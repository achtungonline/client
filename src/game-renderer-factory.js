var GameRenderer = require("./game-renderer.js");
var ShapeRendererFactory = require("./render/shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormRenderer = require("./player/worm-renderer.js");

module.exports = function GameRendererFactory() {
    var shapeRendererFactory = ShapeRendererFactory();

    function createLayeredCanvasRenderer(mapCanvas, wormsCanvas) {
        var mapCanvasContext = mapCanvas.getContext("2d");
        var wormsCanvasContext = wormsCanvas.getContext("2d");

        var mapRenderer = MapRenderer(shapeRendererFactory.create(mapCanvasContext));
        var wormRenderer = WormRenderer(shapeRendererFactory.create(wormsCanvasContext));

        return GameRenderer(mapRenderer, wormRenderer);
    }

    return {
        createLayeredCanvasRenderer: createLayeredCanvasRenderer
    };
};