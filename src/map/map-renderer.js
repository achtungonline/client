module.exports = function MapRenderer(map, shapeRenderer, mapContext, renderProperties) {
    var rendered = false;

    var render = function () {
        if (rendered) {
            return;
        }

        shapeRenderer.render(mapContext, map.shape, "black", "yellow");

        map.blockingShapes.forEach(function (blockingShape) {
            shapeRenderer.render(mapContext, blockingShape, "grey");
        });

        rendered = true;
    };

    return {
        render: render
    }
};