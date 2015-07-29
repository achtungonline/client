module.exports = function MapRenderer(map, shapeRenderer, mapContext) {
    var rendered = false;

    var render = function () {
        if (rendered) {
            return;
        }

        map.zones.forEach(function (zone) {
            shapeRenderer.render(mapContext, zone.shape, "black", "yellow");
        });

        rendered = true;
    };

    return {
        render: render
    }
};