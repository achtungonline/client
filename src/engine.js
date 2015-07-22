var GameFactory = require("core/src/game-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var mapUtils = require("core/src/map-utils.js");

var GameRendererFactory = require("./game-renderer-factory.js");
var requestFrame = require("./request-frame.js");

module.exports = function Engine() {
    function createCanvas(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = "map";
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        return canvas;
    }

    var game = GameFactory(requestFrame).create();
    var circle = ShapeFactory().createCircle(30, 100, 100);

    var canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";

    var mapBoundingBox = mapUtils.getBoundingBox(game.map);
    var mapCanvas = createCanvas("map", mapBoundingBox);
    var wormsCanvas = createCanvas("worms", mapBoundingBox);

    canvasContainer.appendChild(mapCanvas);
    canvasContainer.appendChild(wormsCanvas);

    document.getElementById("game-container").appendChild(canvasContainer);

    var gameRenderer = GameRendererFactory().createLayeredCanvasRenderer(mapCanvas, wormsCanvas);

    return {
        start: function () {
            game.on("updated", function onUpdated() {
                gameRenderer.render(game);
            });

            game.start();
        }
    }
};
