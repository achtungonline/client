module.exports = function MapRenderer(shapeRenderer) {

    var render = function (canvasContext, map) {
        map.shapes.forEach(function (shape) {
            shapeRenderer.render(canvasContext, shape, "black", "yellow");
        });
    };

    return {
        render: render
    }
};