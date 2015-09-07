var GameRenderer = require("./game-renderer.js");
var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormsRenderer = require("./player/worms-renderer.js");
var ShapeModifierImmutable = require("core/src/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var PlayAreaRenderer = require("./play-area/play-area-renderer.js");

module.exports = function GameRendererFactory() {
    var shapeRendererFactory = ShapeRendererFactory();

    function createRenderProperties() {
        return {
            drawArrows: false,
            showTrajectories: false
        };
    }

    function createLayeredCanvasRenderer(gameState, mapCanvas, wormBodiesCanvas, wormHeadsCanvas) {
        var mapCanvasContext = mapCanvas.getContext("2d");
        var wormBodiesContext = wormBodiesCanvas.getContext("2d");
        var wormHeadsContext = wormHeadsCanvas.getContext("2d");

        var renderProperties = createRenderProperties();

        var shapeRenderer = shapeRendererFactory.create();
        var mapRenderer = MapRenderer(gameState.map, shapeRenderer, mapCanvasContext, renderProperties);

        var playAreaRenderer = PlayAreaRenderer(gameState, wormBodiesContext, renderProperties);

        var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());
        var wormsRenderer = WormsRenderer(gameState, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties);

        return GameRenderer(mapRenderer, wormsRenderer, playAreaRenderer, renderProperties);
    }

    return {
        createLayeredCanvasRenderer: createLayeredCanvasRenderer
    };
};