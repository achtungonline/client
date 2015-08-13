module.exports = function PlayAreaRenderer(game, playAreaContext) {

    var playAreaHandler = game.gameState.playAreaHandler;
    var mapBoundingBox = game.gameState.map.shape.boundingBox;

    playAreaContext.rect(0, 0, mapBoundingBox.width, mapBoundingBox.height);
    playAreaContext.fillStyle = "grey";
    playAreaContext.fill();

    var render = function () {
        var updatedPixels = playAreaHandler.getUpdateBuffer();
        playAreaHandler.resetUpdateBuffer();

        var image = playAreaContext.getImageData(0, 0, mapBoundingBox.width, mapBoundingBox.height);
        var data = image.data;

        updatedPixels.forEach(function (pixel) {
            var index = pixel[0];
            var wormId = pixel[1];
            data[4*index] = 0; // R
            data[4*index+1] = 0; // G
            data[4*index+2] = 255; // B
            data[4*index+3] = 255; // A
        });

        playAreaContext.putImageData(image, 0, 0);
    };

    return {
        render: render
    }
};