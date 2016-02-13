var GameFactory = require("core/src/game-factory.js");
var MapFactory = require("core/src/core/map/map-factory.js");
var ShapeFactory = require("core/src/core/geometry/shape-factory.js");
var idGenerators = require("core/src/core/util/id-generator.js");

/**
 * Creates game instances on the client using core
 * @returns {create}
 * @constructor
 */
module.exports = function LocalGameFactory() {
    var idGenerator = idGenerators.indexCounterId(0);

    function create(numberOfHumanPlayers, numberOfAIPlayers, map, seed) {
        var sf = ShapeFactory();
        if (map === undefined) {
            var mapShape = sf.createRectangle(800, 1000, 0, 0);
            var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
            map = MapFactory().create(mapShape, mapObstaclesShapes);
        }

        function generatePlayers(n, type) {
            var config = [];
            for (var i = 0; i < n; i++) {
                config.push({
                    id: idGenerator(),
                    type: type
                });
            }
            return config;
        }

        var playerConfigs = generatePlayers(numberOfHumanPlayers, 'human').concat(generatePlayers(numberOfAIPlayers, 'bot'));

        var game = GameFactory().create({
            playerConfigs: playerConfigs,
            map: map,
            seed: seed
        });
        return game;
    }

    return {
        create: create
    };
};
