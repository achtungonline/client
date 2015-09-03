var PlayArea = require("core/src/play-area/play-area.js");
var COLORS = require("./../default-values.js").player.COLORS;
var canvasImageDataUtils = require("./canvas-image-data-utils.js");

module.exports = function PlayAreaRenderer(game, playAreaContext, renderProperties) {

    var mapBoundingBox = game.gameState.map.shape.boundingBox;

    var image = playAreaContext.getImageData(0, 0, mapBoundingBox.width, mapBoundingBox.height);

    var render = function () {
        var updatedPixels = game.getPlayAreaUpdateBuffer();

        var data = image.data;

        updatedPixels.forEach(function (pixel) {
            var color = [0, 0, 0, 0];
            if (pixel.value !== PlayArea.FREE && pixel.value !== PlayArea.OBSTACLE) {
                var wormId = pixel.value;
                color = COLORS[wormId];
            }
            canvasImageDataUtils.setColorByIndex(data, pixel.index, color);

        });

        playAreaContext.putImageData(image, 0, 0);
    };

    return {
        render: render
    }
};