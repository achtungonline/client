var GameFactory = require("core/src/game-factory.js");
var PlayerFactory = require("core/src/player/player-factory.js");
var WormFactory = require("core/src/player/worm/worm-factory.js");
var MapFactory = require("core/src/map/map-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var idGenerator = require("core/src/util/id-generator.js");
var Random = require("core/src/util/random.js");
var requestFrame = require("./request-frame.js");

/**
 * Creates game instances on the client using core
 * @returns {create}
 * @constructor
 */
module.exports = function LocalGameFactory() {

    function create(numberOfHumanPlayers, numberOfAIPlayers, map) {
        var sf = ShapeFactory();
        if (map === undefined) {
            var mapShape = sf.createRectangle(800, 1000, 0, 0);
            var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
            map = MapFactory().create(mapShape, mapObstaclesShapes);
        }

        var wormFactory = WormFactory(idGenerator.indexCounterId(0));
        var playerFactory = PlayerFactory(idGenerator.indexCounterId(0), wormFactory);
        var playerSetup = {};
        playerSetup.humanPlayers = playerFactory.createPlayers(numberOfHumanPlayers);
        playerSetup.AIPlayers = playerFactory.createPlayers(numberOfAIPlayers);

        var random = Random();

        return GameFactory(requestFrame).create(playerSetup, map, random);
    }

    return {
        create: create
    };
};
