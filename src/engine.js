var GameFactory = require("core/src/game-factory.js");
var PlayerFactory = require("core/src/player/player-factory.js");
var idGenerator = require("core/src/util/id-generator.js");
var mapUtils = require("core/src/map-utils.js");

var PlayerSteeringListenerFactory = require("./player/player-steering-listener-factory.js");
var GameRendererFactory = require("./game-renderer-factory.js");
var requestFrame = require("./request-frame.js");
var KEY_BINDINGS = require("./default-values.js").player.KEY_BINDINGS;


module.exports = function Engine(gameContainer) {
    function createCanvas(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = name;
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        return canvas;
    }

    function createGame(numberOfPlayers) {
        var players = PlayerFactory(idGenerator.indexCounterId(0)).createPlayers(numberOfPlayers);
        var game = GameFactory(requestFrame).create(players);
        return game;
    }

    function setupSteeringListenerEvents(game) {
        var playerSteeringListener = PlayerSteeringListenerFactory(game).create();
        var players = game.players;
        for (var i = 0; i < players.length; i++) {
            var keyBindings = KEY_BINDINGS[i];
            var leftKey = keyBindings[0];
            var rightKey = keyBindings[1];
            playerSteeringListener.addListener(players[i], leftKey, rightKey);
        }
    }

    var canvasContainer = document.createElement("div");
    canvasContainer.className = "canvas-container";

    var game = createGame(3);
    setupSteeringListenerEvents(game);

    var mapBoundingBox = mapUtils.getBoundingBox(game.map);
    var mapCanvas = createCanvas("map", mapBoundingBox);
    var wormsCanvas = createCanvas("worms", mapBoundingBox);

    canvasContainer.appendChild(mapCanvas);
    canvasContainer.appendChild(wormsCanvas);

    gameContainer.appendChild(canvasContainer);

    var gameRenderer = GameRendererFactory().createLayeredCanvasRenderer(mapCanvas, wormsCanvas);

    return {

        start: function () {
            game.on("updated", function onUpdated() {
                gameRenderer.render(game);
            });

            game.start();
        }
    }
};
