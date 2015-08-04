var GameRenderer = require("./game-renderer.js");
var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormsRenderer = require("./player/worms-renderer.js");
var ShapeModifierImmutable = require("core/src/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");

module.exports = function GameRendererFactory() {
    var shapeRendererFactory = ShapeRendererFactory();

    function createLayeredCanvasRenderer(game, mapCanvas, wormBodiesCanvas, wormHeadsCanvas) {
        var mapCanvasContext = mapCanvas.getContext("2d");
        var wormBodiesContext = wormBodiesCanvas.getContext("2d");
        var wormHeadsContext = wormHeadsCanvas.getContext("2d");

        var shapeRenderer = shapeRendererFactory.create();
        var mapRenderer = MapRenderer(game.map, shapeRenderer, mapCanvasContext);
        var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());
        var wormsRenderer = WormsRenderer(game, shapeRenderer, wormBodiesContext, wormHeadsContext, shapeModifierImmutable);

        return GameRenderer(mapRenderer, wormsRenderer);
    }

    return {
        createLayeredCanvasRenderer: createLayeredCanvasRenderer
    };
};