var GameFactory = require("core/src/game-factory.js");
var PlayerFactory = require("core/src/player/player-factory.js");
var WormFactory = require("core/src/player/worm/worm-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var idGenerator = require("core/src/util/id-generator.js");
var Random = require("core/src/util/random.js");
var requestFrame = require("../local-game/request-frame.js");
var ReplayDeltaTimeHandler = require("./replay-delta-time-handler.js");


module.exports = function ReplayFactory() {

    function create(gameHistory) {
        var map = gameHistory.map;

        var wormFactory = WormFactory(idGenerator.indexCounterId(0));
        var playerFactory = PlayerFactory(idGenerator.indexCounterId(0), wormFactory);
        var playerSetup = {};
        playerSetup.humanPlayers = playerFactory.createPlayers(gameHistory.numberOfPlayers);
        playerSetup.AIPlayers = playerFactory.createPlayers(0);

        var deltaTimeHandler = ReplayDeltaTimeHandler(requestFrame, gameHistory);

        var random = Random(gameHistory.seed);
        return GameFactory(deltaTimeHandler).create(playerSetup, map, random);
    }

    return {
        create: create
    };
};
