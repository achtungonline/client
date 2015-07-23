var GameRenderer = require("./game-renderer.js");
var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormsRenderer = require("./player/worms-renderer.js");

module.exports = function GameRendererFactory() {
    var shapeRendererFactory = ShapeRendererFactory();

    function createLayeredCanvasRenderer(game, mapCanvas, wormBodiesCanvas, wormHeadsCanvas) {
        var mapCanvasContext = mapCanvas.getContext("2d");
        var wormBodiesContext = wormBodiesCanvas.getContext("2d");
        var wormHeadsContext = wormHeadsCanvas.getContext("2d");

        var shapeRenderer = shapeRendererFactory.create();
        var mapRenderer = MapRenderer(game.map, shapeRenderer, mapCanvasContext);
        var wormsRenderer = WormsRenderer(game, shapeRenderer, wormBodiesContext, wormHeadsContext);

        return GameRenderer(mapRenderer, wormsRenderer);
    }

    return {
        createLayeredCanvasRenderer: createLayeredCanvasRenderer
    };
};