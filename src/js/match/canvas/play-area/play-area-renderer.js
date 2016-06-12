var PlayArea = require("core/src/core/play-area/play-area.js");
var playerUtils = require("core/src/core/player/player-utils.js");
var utils = require("./../../../utils.js");
var canvasImageDataUtils = require("./../canvas-image-data-utils.js");

module.exports = function PlayAreaRenderer(options) {
    var gameState = options.gameState;
    var playerConfigs = options.playerConfigs;
    var playAreaContext = options.playAreaContext;
    var scale = options.scale; // Need to handle scale manually since we do pixel manipulation in this renderer. Can for now only handle lower scales

    var UPDATE_GRANULARITY = 50;

    var playAreaHeight = gameState.map.shape.boundingBox.height;
    var playAreaWidth = gameState.map.shape.boundingBox.width;
    var updateRows = Math.ceil(playAreaHeight / UPDATE_GRANULARITY);
    var updateCols = Math.ceil(playAreaWidth / UPDATE_GRANULARITY);
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
            var updateSquareRow = Math.floor(row / UPDATE_GRANULARITY);
            var updatedSquareCol = Math.floor(col / UPDATE_GRANULARITY);
            updatedSquare[updateSquareRow * updateCols + updatedSquareCol] = true;
            var scaledIndex = scale ? Math.floor(Math.floor(row * scale) * playAreaWidth + (col * scale)) : pixel.index;
            canvasImageDataUtils.setColorByIndex(data, scaledIndex, rgbColor);
        });

        for (var row = 0; row < updateRows; row++) {
            for (var col = 0; col < updateCols; col++) {
                if (updatedSquare[row * updateCols + col]) {
                    updatedSquare[row * updateCols + col] = false;
                    playAreaContext.putImageData(image, 0, 0);

                    //playAreaContext.putImageData(image, 0, 0, col * UPDATE_GRANULARITY, row * UPDATE_GRANULARITY, UPDATE_GRANULARITY, UPDATE_GRANULARITY);
                }
            }
        }
    };

    return {
        render: render
    };
};
