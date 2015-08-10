var GameFactory = require("core/src/game-factory.js");
var PlayerFactory = require("core/src/player/player-factory.js");
var WormFactory = require("core/src/player/worm/worm-factory.js");
var MapFactory = require("core/src/map/map-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var idGenerator = require("core/src/util/id-generator.js");
var RandomAI = require("core/src/player/ai/random-ai.js");

var PlayerSteeringListenerFactory = require("./player/player-steering-listener-factory.js");
var GameRendererFactory = require("./game-renderer-factory.js");
var requestFrame = require("./request-frame.js");
var KEY_BINDINGS = require("./default-values.js").player.KEY_BINDINGS;
var FpsHandler = require("./fps-handler.js");


module.exports = function Engine(gameContainer) {
    function createCanvas(name, boundingBox) {
        var canvas = document.createElement("canvas");
        canvas.className = name;
        canvas.width = boundingBox.width;
        canvas.height = boundingBox.height;
        return canvas;
    }

    function createGame(numberOfPlayers) {
        var sf = ShapeFactory();
        var mapShape = sf.createSquare(800, 0, 0);
        var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
        var map = MapFactory().create(mapShape, mapObstaclesShapes);

        var wormFactory = WormFactory(idGenerator.indexCounterId(0));
        var players = PlayerFactory(idGenerator.indexCounterId(0), wormFactory).createPlayers(numberOfPlayers);

        var game = GameFactory(requestFrame).create(players, map);
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

    function setupGameRenderer(game) {
        var mapBoundingBox = game.map.shape.boundingBox;

        var canvasContainer = document.createElement("div");
        canvasContainer.className = "canvas-container";
        canvasContainer.style.width = mapBoundingBox.width;
        canvasContainer.style.height = mapBoundingBox.height;

        var mapCanvas = createCanvas("map", mapBoundingBox);
        var wormBodiesCanvas = createCanvas("wormBodies", mapBoundingBox);
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);

        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(wormBodiesCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);

        gameContainer.appendChild(canvasContainer);

        return GameRendererFactory().createLayeredCanvasRenderer(game, mapCanvas, wormBodiesCanvas, wormHeadsCanvas);
    }

    var game = createGame(3);
    setupSteeringListenerEvents(game);
    game.setAIPlayer(game.players[1], RandomAI(game.players[1]));
    game.setAIPlayer(game.players[2], RandomAI(game.players[2]));

    var gameRenderer = setupGameRenderer(game);

    var fpsHandler = FpsHandler();
    fpsHandler.on("fpsChanged", function (fps) {
        document.getElementById("fps").innerHTML = fps;
    });

    game.on("gameUpdated", function onUpdated(deltaTime) {
        gameRenderer.render();
        fpsHandler.update();
    });

    game.on("gameOver", function onGameOver() {
        console.log("game over");
    });

    return {
        start: function () {
            fpsHandler.start();
            game.start();
        }
    }
};
