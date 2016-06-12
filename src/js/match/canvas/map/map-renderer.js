module.exports = function MapRenderer(map, shapeRenderer, mapContext) {
    var rendered = false;

    var render = function () {
        if (rendered) {
            return;
        }

        shapeRenderer.render({
            canvasContext: mapContext,
            shape: map.shape,
            fillColor: "#faf7ed"
        });

        rendered = true;
    };

    return {
        render: render
    };
};