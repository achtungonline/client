var requestFrame = require("./request-frame.js");
var DeltaTimeHandler = require("./delta-time-handler.js");
var LocalGame = require("./local-game.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var MapFactory = require("core/src/core/map/map-factory.js");
var Random = require("core/src/core/util/random.js");
var GameFactory = require("core/src/game-factory.js");
var ShapeFactory = require("core/src/core/geometry/shape-factory.js");


/**
 * Creates game instances on the client using core
 * @returns {create}
 * @constructor
 */
module.exports = function LocalGameFactory() {
    var gameFactory = GameFactory();
    var deltaTimeHandler = DeltaTimeHandler(requestFrame);

    // function create(numberOfHumanPlayers, numberOfAIPlayers, map, seed) {
    //     if(seed === undefined) {
    //         seed = Math.random();
    //     }
    //
    //     var game = gameFactory.create(numberOfHumanPlayers, numberOfAIPlayers, map, seed);
    //     var gameHistoryHandler = GameHistoryHandler();
    //     var localGame = LocalGame(game, gameHistoryHandler, deltaTimeHandler, seed);
    //     return localGame;
    // }

    function create(options) {
        var playerConfigs = options.playerConfigs;      //required
        var map = options.map || createDefaultMap();    //optional
        var seed = options.seed;                        //optional

        function createDefaultMap() {
            var sf = ShapeFactory();
            var mapShape = sf.createRectangle(800, 1000, 0, 0);
            var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
            return MapFactory().create(mapShape, mapObstaclesShapes);
        }

        var random = Random(seed);

        var game = GameFactory().create({
            playerConfigs: playerConfigs,
            map: map,
            random: random
        });
        var gameHistoryHandler = GameHistoryHandler();
        var localGame = LocalGame(game, gameHistoryHandler, deltaTimeHandler, seed);
        return localGame;
    }

    return {
        create: create
    };
};
