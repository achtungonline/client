module.exports = function MapRenderer(map, shapeRenderer, mapContext, renderProperties) {
    var rendered = false;

    var render = function () {
        if (rendered) {
            return;
        }

        shapeRenderer.render(mapContext, map.shape, "black", "yellow");

        rendered = true;
    };

    return {
        render: render
    };
};