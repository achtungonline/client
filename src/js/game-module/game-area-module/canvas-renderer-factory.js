var CanvasRenderer = require("./canvas-renderer.js");
var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormsRenderer = require("./worm/worms-renderer.js");
var ShapeModifierImmutable = require("core/src/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var PlayAreaRenderer = require("./play-area/play-area-renderer.js");
var PowerUpRenderer = require("./power-up/power-up-renderer.js");

module.exports = function CanvasRendererFactory() {
    var shapeRendererFactory = ShapeRendererFactory();

    function createRenderProperties() {
        return {
            drawArrows: false,
            showTrajectories: false
        };
    }

    function createLayeredCanvasRenderer(gameState, mapCanvas, wormHeadsCanvas, powerUpCanvas, playAreaCanvas) {
        var mapCanvasContext = mapCanvas.getContext("2d");
        var wormHeadsContext = wormHeadsCanvas.getContext("2d");
        var powerUpContext = powerUpCanvas.getContext("2d");
        var playAreaContext = playAreaCanvas.getContext("2d");

        var renderProperties = createRenderProperties();

        var shapeRenderer = shapeRendererFactory.create();
        var mapRenderer = MapRenderer(gameState.map, shapeRenderer, mapCanvasContext, renderProperties);

        var powerUpRenderer = PowerUpRenderer(gameState, powerUpContext, shapeRenderer, renderProperties);

        var playAreaRenderer = PlayAreaRenderer(gameState, playAreaContext, renderProperties);

        var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());
        var wormHeadsRenderer = WormsRenderer(gameState, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties);

        return CanvasRenderer(mapRenderer, wormHeadsRenderer, powerUpRenderer, playAreaRenderer, renderProperties);
    }

    return {
        createLayeredCanvasRenderer: createLayeredCanvasRenderer
    };
};