var PlayArea = require("core/src/play-area/play-area.js");
var COLORS = require("./../default-values.js").player.COLORS;
var canvasImageDataUtils = require("./canvas-image-data-utils.js");

module.exports = function PlayAreaRenderer(game, playAreaContext) {

    var playAreaHandler = game.gameState.playAreaHandler;
    var mapBoundingBox = game.gameState.map.shape.boundingBox;

    playAreaContext.rect(0, 0, mapBoundingBox.width, mapBoundingBox.height);
    playAreaContext.fillStyle = "black";
    playAreaContext.fill();

    var image = playAreaContext.getImageData(0, 0, mapBoundingBox.width, mapBoundingBox.height);

    var render = function () {
        var updatedPixels = playAreaHandler.getUpdateBuffer();
        playAreaHandler.resetUpdateBuffer();

        var data = image.data;

        updatedPixels.forEach(function (pixel) {
            var index = pixel[0];
            var wormId = pixel[1];
            var color = [0, 0, 0];
            if (wormId === PlayArea.OBSTACLE) {
                color = [50, 50, 50];
            } else {
                color = COLORS[wormId];
            }
            canvasImageDataUtils.setColorByIndex(data, index, color);

        });

        playAreaContext.putImageData(image, 0, 0);
    };

    return {
        render: render
    }
};