var PlayArea = require("core/src/play-area/play-area.js");
var COLORS = require("./../default-values.js").player.COLORS;

module.exports = function PlayAreaRenderer(game, playAreaContext) {

    var playAreaHandler = game.gameState.playAreaHandler;
    var mapBoundingBox = game.gameState.map.shape.boundingBox;

    playAreaContext.rect(0, 0, mapBoundingBox.width, mapBoundingBox.height);
    playAreaContext.fillStyle = "black";
    playAreaContext.fill();

    var render = function () {
        var updatedPixels = playAreaHandler.getUpdateBuffer();
        playAreaHandler.resetUpdateBuffer();

        var image = playAreaContext.getImageData(0, 0, mapBoundingBox.width, mapBoundingBox.height);
        var data = image.data;

        updatedPixels.forEach(function (pixel) {
            var index = pixel[0];
            var wormId = pixel[1];
            var color = [0,0,0];
            if (wormId === PlayArea.OBSTACLE) {
                color = [50,50,50];
            } else {
                color = COLORS[wormId];
            }
            data[4*index] = color[0]; // R
            data[4*index+1] = color[1]; // G
            data[4*index+2] = color[2]; // B
            data[4*index+3] = 255; // A
        });

        playAreaContext.putImageData(image, 0, 0);
    };

    return {
        render: render
    }
};