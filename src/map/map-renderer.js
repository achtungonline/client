module.exports = function MapRenderer(shapeRenderer) {

    var render = function (map) {
        map.shapes.forEach(function (shape) {
            shapeRenderer.render(shape, "black", "yellow");
        });
    };

    return {
        render: render
    }
};