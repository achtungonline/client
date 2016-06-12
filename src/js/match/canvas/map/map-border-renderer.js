var ShapeFactory = require("core/src/core/geometry/shape-factory.js");
var ShapeModifierImmutable = require("core/src/core/geometry/shape-modifier-immutable.js");

var shapeModifierImmutable = ShapeModifierImmutable(ShapeFactory());

module.exports = function MapRenderer(map, shapeRenderer, mapBorderContext, borderWidth) {
    var rendered = false;

    var render = function () {
        if (rendered) {
            return;
        }

        var mapBorder = shapeModifierImmutable.changeSize(map.shape, borderWidth * 2, borderWidth * 2);
        mapBorder = shapeModifierImmutable.move(mapBorder, borderWidth, borderWidth);

        shapeRenderer.render({
            canvasContext: mapBorderContext,
            shape: mapBorder,
            fillColor: "black"
        });

        rendered = true;
    };

    return {
        render: render
    };
};