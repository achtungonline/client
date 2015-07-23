module.exports = function MapRenderer(map, shapeRenderer, mapContext) {
    var rendered = false;

    var render = function () {
        if (rendered) {
            return;
        }

        map.shapes.forEach(function (shape) {
            shapeRenderer.render(mapContext, shape, "black", "yellow");
        });

        rendered = true;
    };

    return {
        render: render
    }
};