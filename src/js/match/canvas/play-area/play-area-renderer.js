var PlayArea = require("core/src/core/play-area/play-area.js");
var playerUtils = require("core/src/core/player/player-utils.js");
var utils = require("./../../../utils.js");
var canvasImageDataUtils = require("./../canvas-image-data-utils.js");

module.exports = function PlayAreaRenderer(gameState, playerConfigs, playAreaContext, renderProperties) {

    var UPDATE_GRANULARITY = 50; // Assuming map width and height is a multiple of the granularity

    var playAreaWidth = gameState.map.shape.boundingBox.width;
    var playAreaHeight = gameState.map.shape.boundingBox.height;
    var updateRows = playAreaHeight / UPDATE_GRANULARITY;
    var updateCols = playAreaWidth / UPDATE_GRANULARITY;
    var updatedSquare = new Array(updateRows * updateCols);
    updatedSquare.forEach(function (value, index) {
        updatedSquare[index] = false;
    });

    var image = playAreaContext.getImageData(0, 0, playAreaWidth, playAreaHeight);

    var render = function () {
        var updatedPixels = gameState.playAreaUpdateBuffer;

        var data = image.data;

        updatedPixels.forEach(function (pixel) {
            var rgbColor;
            if (pixel.value === PlayArea.FREE) {
                rgbColor = [0, 0, 0, 0];
            } else if (pixel.value === PlayArea.OBSTACLE) {
                rgbColor = [100, 100, 100];
            } else {
                var wormId = pixel.value;
                var worm = playerUtils.getWormById(gameState.worms, wormId);
                var hexColor = playerConfigs.find(pc => pc.id === worm.playerId).color.hexCode;
                rgbColor = utils.hexToRgb(hexColor);
            }
            var row = Math.floor(pixel.index / playAreaWidth);
            var col = pixel.index - row * playAreaWidth;
            row = Math.floor(row / UPDATE_GRANULARITY);
            col = Math.floor(col / UPDATE_GRANULARITY);
            updatedSquare[row * updateCols + col] = true;
            canvasImageDataUtils.setColorByIndex(data, pixel.index, rgbColor);
        });

        for (var row = 0; row < updateRows; row++) {
            for (var col = 0; col < updateCols; col++) {
                if (updatedSquare[row * updateCols + col]) {
                    updatedSquare[row * updateCols + col] = false;
                    playAreaContext.putImageData(image, 0, 0, col * UPDATE_GRANULARITY, row * UPDATE_GRANULARITY, UPDATE_GRANULARITY, UPDATE_GRANULARITY);
                }
            }
        }
    };

    return {
        render: render
    };
};
