var GameFactory = require("core/src/game-factory.js");
var PlayerFactory = require("core/src/player/player-factory.js");
var MapFactory = require("core/src/map/map-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var idGenerator = require("core/src/util/id-generator.js");
var Random = require("core/src/util/random.js");
var requestFrame = require("./request-frame.js");
var DeltaTimeHandler = require("./delta-time-handler.js");

/**
 * Creates game instances on the client using core
 * @returns {create}
 * @constructor
 */
module.exports = function LocalGameFactory() {

    function create(numberOfHumanPlayers, numberOfAIPlayers, map, seed) {
        var sf = ShapeFactory();
        if (map === undefined) {
            var mapShape = sf.createRectangle(800, 1000, 0, 0);
            var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
            map = MapFactory().create(mapShape, mapObstaclesShapes);
        }

        var playerFactory = PlayerFactory(idGenerator.indexCounterId(0));
        var playerSetup = {};
        playerSetup.humanPlayers = playerFactory.createPlayers(numberOfHumanPlayers);
        playerSetup.AIPlayers = playerFactory.createPlayers(numberOfAIPlayers);

        var deltaTimeHandler = DeltaTimeHandler(requestFrame);

        var random = Random(seed);
        var game = GameFactory(deltaTimeHandler).create(playerSetup, map, random);
        game.seed = random.getSeed();

        return game;
    }

    return {
        create: create
    };
};
