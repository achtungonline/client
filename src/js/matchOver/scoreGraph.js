var gameStateFunctions = require("core/src/core/game-state-functions.js");
var scoreUtil = require("core/src/core/score/score-util.js");
var GameCanvasRenderer = require("../match/canvas/game-canvas-renderer.js");
var ReplayGameHandler = require("../match/local-game/replay/replay-game-handler.js");

var ANIMATION_DURATION = 0.5;
var WIDTH = 600;
var HEIGHT = 400;
var MARGIN_X = 4;
var MARGIN_Y = 0.5;
var BORDER_WIDTH = 4;
var LINE_WIDTH = 3;

module.exports = function ScoreGraph({ scoreGraphContainer, roundsData, playerConfigs }) {

    var lastRoundData = roundsData[roundsData.length - 1];
    var maxScore = Math.max(1, 1.15*scoreUtil.getHighestScore(scoreUtil.combineScores(lastRoundData.startScore, lastRoundData.roundScore)));
    var dx = WIDTH / roundsData.length;
    var dy = HEIGHT / maxScore;
    var dt = ANIMATION_DURATION / roundsData.length;

    var gameState = {
        wormPathSegments: {},
        players: playerConfigs.map(pc => ({ id: pc.id })),
        gameEvents: [],
        powerUpEvents: [],
        gameTime: ANIMATION_DURATION,
        map: gameStateFunctions.createMapRectangle("ScoreGraph", WIDTH + 2*MARGIN_X, HEIGHT + 2*MARGIN_Y)
    };

    for (var i = 0; i < roundsData.length; i++) {
        var roundData = roundsData[i];
        playerConfigs.forEach(function (player) {
            if (i === 0) {
                gameState.wormPathSegments[player.id] = [];
            }
            gameState.wormPathSegments[player.id].push({
                type: "straight",
                playerId: player.id,
                size: LINE_WIDTH,
                jump: false,
                startTime: dt*i,
                duration: dt,
                endTime: dt*(i+1),
                startX: MARGIN_X + dx*i,
                endX: MARGIN_X + dx*(i+1),
                startY: HEIGHT - MARGIN_Y - roundData.startScore[player.id] * dy,
                endY: HEIGHT - MARGIN_Y - (roundData.startScore[player.id] + roundData.roundScore[player.id]) * dy
            });
        });
    }


    var gameCanvasRenderer = GameCanvasRenderer({ gameState, playerConfigs, mapBorderWidth: BORDER_WIDTH });
    var replayGameHandler = ReplayGameHandler({
        gameState,
        onReplayUpdate: function (replayTime) {
            gameCanvasRenderer.render({
                renderTime: replayTime
            });
        },
        onReplayOver: function() {}
    });
    scoreGraphContainer.innerHTML = "";
    scoreGraphContainer.appendChild(gameCanvasRenderer.container);

    function animate() {
        replayGameHandler.start();
    }

    return {
        animate
    };
};