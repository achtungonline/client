var GameFactory = require("core/src/game-factory.js");
var PlayerFactory = require("core/src/player/player-factory.js");
var WormFactory = require("core/src/player/worm/worm-factory.js");
var MapFactory = require("core/src/map/map-factory.js");
var ShapeFactory = require("core/src/geometry/shape-factory.js");
var idGenerator = require("core/src/util/id-generator.js");

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

    function createGame(numberOfHumanPlayers, numberOfAIPlayers) {
        var sf = ShapeFactory();
        var mapShape = sf.createSquare(800, 0, 0);
        var mapObstaclesShapes = [sf.createCircle(100, 100, 300), sf.createRectangle(200, 300, 500, 250)];
        var map = MapFactory().create(mapShape, mapObstaclesShapes);

        var wormFactory = WormFactory(idGenerator.indexCounterId(0));
        var playerFactory = PlayerFactory(idGenerator.indexCounterId(0), wormFactory);
        var playerSetup = {};
        playerSetup.humanPlayers = playerFactory.createPlayers(numberOfHumanPlayers);
        playerSetup.AIPlayers = playerFactory.createPlayers(numberOfAIPlayers);
        var game = GameFactory(requestFrame).create(playerSetup, map);
        return game;
    }

    function setupSteeringListenerEvents(game) {
        var playerSteeringListener = PlayerSteeringListenerFactory(game).create();
        var players = game.gameState.players;
        for (var i = 0; i < players.length; i++) {
            var keyBindings = KEY_BINDINGS[i];
            var leftKey = keyBindings[0];
            var rightKey = keyBindings[1];
            playerSteeringListener.addListener(players[i], leftKey, rightKey);
        }
    }

    function setupGameRenderer(game) {
        var mapBoundingBox = game.gameState.map.shape.boundingBox;

        var canvasContainer = document.createElement("div");
        canvasContainer.className = "canvas-container";
        canvasContainer.style.width = mapBoundingBox.width;
        canvasContainer.style.height = mapBoundingBox.height;

        var canvasContainer2 = document.createElement("div");
        canvasContainer2.className = "canvas-container2";
        canvasContainer2.style.width = mapBoundingBox.width;
        canvasContainer2.style.height = mapBoundingBox.height;

        var mapCanvas = createCanvas("map", mapBoundingBox);
        var wormBodiesCanvas = createCanvas("wormBodies", mapBoundingBox);
        var wormHeadsCanvas = createCanvas("wormHeads", mapBoundingBox);
        var playAreaCanvas = createCanvas("playArea", mapBoundingBox);

        canvasContainer.appendChild(mapCanvas);
        canvasContainer.appendChild(wormBodiesCanvas);
        canvasContainer.appendChild(wormHeadsCanvas);

        canvasContainer2.appendChild(playAreaCanvas);

        gameContainer.appendChild(canvasContainer);
        var testContainer = document.getElementById("test");
        testContainer.appendChild(canvasContainer2);

        return GameRendererFactory().createLayeredCanvasRenderer(game, mapCanvas, wormBodiesCanvas, wormHeadsCanvas, playAreaCanvas);
    }
    var game = createGame(1, 4);
    setupSteeringListenerEvents(game);

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
