var MAP_BACKGROUND_COLOR = "#faf7ed";
var MAP_BORDER_COLOR = "black";

module.exports = function MapRenderer(options) {

    var canvas = options.canvas;
    var context = canvas.getContext("2d");
    var shapeRenderer = options.shapeRenderer;
    var borderWidth = options.borderWidth;
    var rendered = false;

    var render = function (gameState, renderStartTime, renderEndTime) {
        if (rendered) {
            return;
        }

        shapeRenderer.render({
            canvasContext: context,
            shape: gameState.map.shape,
            fillColor: MAP_BACKGROUND_COLOR,
            borderWidth: borderWidth,
            borderColor: MAP_BORDER_COLOR
        });

        rendered = true;
    };

    return {
        render: render
    };
};
