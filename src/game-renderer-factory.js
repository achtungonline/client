var GameRenderer = require("./game-renderer.js");
var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormsRenderer = require("./player/worms-renderer.js");
var ShapeModifierImmutable = require("core/src/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var PlayAreaRenderer = require("./play-area/play-area-renderer.js");

module.exports = function GameRendererFactory() {
    var shapeRendererFactory = ShapeRendererFactory();

    function createLayeredCanvasRenderer(game, mapCanvas, wormBodiesCanvas, wormHeadsCanvas, playAreaCanvas) {
        var mapCanvasContext = mapCanvas.getContext("2d");
        var wormBodiesContext = wormBodiesCanvas.getContext("2d");
        var wormHeadsContext = wormHeadsCanvas.getContext("2d");
        var playAreaContext = playAreaCanvas.getContext("2d");

        var shapeRenderer = shapeRendererFactory.create();
        var mapRenderer = MapRenderer(game.gameState.map, shapeRenderer, mapCanvasContext);
        var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());
        var wormsRenderer = WormsRenderer(game, shapeRenderer, wormBodiesContext, wormHeadsContext, shapeModifierImmutable);
        var playAreaRenderer = PlayAreaRenderer(game, playAreaContext);

        return GameRenderer(mapRenderer, wormsRenderer, playAreaRenderer);
    }

    return {
        createLayeredCanvasRenderer: createLayeredCanvasRenderer
    };
};