module.exports = function MapRenderer(paperScope) {
    var mapLayer = new paperScope.Layer();
    var mapShape;

    function createMapShape(map) { 
        var shape;
        if (map.shape.type === "rectangle") {
            shape = new paperScope.Path.Rectangle([map.shape.x, map.shape.y], [map.shape.maxX, map.shape.maxY]);
        } else {
            shape = new paperScope.Path.Circle([map.shape.centerX, map.shape.centerY], map.shape.radius);
        }
        shape.fillColor = "#faf7ed";
        return shape;
    }
    
    function update(gameState) {
        mapLayer.activate();
        if (mapShape === undefined) {
            mapShape = createMapShape(gameState.map);
        }
    }

    return {
        update: update
    };
};
