var ShapeRendererFactory = require("./shape/shape-renderer-factory.js");
var MapRenderer = require("./map/map-renderer.js");
var WormsRenderer = require("./worm/worms-renderer.js");
var ShapeModifierImmutable = require("core/src/core/geometry/shape-modifier-immutable.js");
var ShapeFactory = require("core/src/core/geometry/shape-factory.js");
var PlayAreaRenderer = require("./play-area/play-area-renderer.js");
var PowerUpRenderer = require("./power-up/power-up-renderer.js");

module.exports = function CanvasRenderer(options) {
    var gameState = options.gameState;
    var playerConfigs = options.playerConfigs;
    var mapCanvas = options.mapCanvas;
    var wormHeadsCanvas = options.wormHeadsCanvas;
    var powerUpCanvas = options.powerUpCanvas;
    var playAreaCanvas = options.playAreaCanvas;

    var mapCanvasContext = mapCanvas.getContext("2d");
    var wormHeadsContext = wormHeadsCanvas.getContext("2d");
    var powerUpContext = powerUpCanvas.getContext("2d");
    var playAreaContext = playAreaCanvas.getContext("2d");

    var renderProperties = createRenderProperties();

    var shapeRenderer = ShapeRendererFactory().create();
    var mapRenderer = MapRenderer(gameState.map, shapeRenderer, mapCanvasContext, renderProperties);
    var powerUpRenderer = PowerUpRenderer(gameState, powerUpContext, shapeRenderer, renderProperties);
    var playAreaRenderer = PlayAreaRenderer(gameState, playerConfigs, playAreaContext, renderProperties);
    var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());
    var wormHeadsRenderer = WormsRenderer(gameState, playerConfigs, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties);

    function createRenderProperties() {
        return {
            drawArrows: false,
            showTrajectories: false
        };
    }

    function render() {
        mapRenderer.render();
        wormHeadsRenderer.render();
        powerUpRenderer.render();
        playAreaRenderer.render();
    }

    function setRenderProperty(property, value) {
        renderProperties[property] = value;
    }

    return {
        render: render,
        setRenderProperty: setRenderProperty
    };
};