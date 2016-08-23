var React = require("react");

var gameStateFunctions = require("core/src/core/game-state-functions.js");
var scoreUtil = require("core/src/core/score/score-util.js");
var GameCanvas = require("../match/canvas/game-canvas-component.js");
var ReplayGameHandler = require("../match/local-game/replay/replay-game-handler.js");

var ANIMATION_DURATION = 0.5;
var WIDTH = 600;
var HEIGHT = 400;
var MARGIN_X = 4;
var MARGIN_Y = 0.5;
var BORDER_WIDTH = 4;
var LINE_WIDTH = 3;

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            roundsData: null,
            players: null
        };
    },
    getInitialState: function() {
        return {
            gameState: null,
            renderTime: 0
        };
    },
    render: function() {
        return (
            <GameCanvas gameState={this.state.gameState} playerConfigs={this.props.players} renderTime={this.state.renderTime} mapBorderWidth={BORDER_WIDTH} />
        );
    },
    componentWillMount: function() {
        var roundsData = this.props.roundsData;
        var lastRoundData = roundsData[roundsData.length - 1];
        var maxScore = Math.max(1, 1.15*scoreUtil.getHighestScore(scoreUtil.combineScores(lastRoundData.startScore, lastRoundData.roundScore)));
        var dx = WIDTH / roundsData.length;
        var dy = HEIGHT / maxScore;
        var dt = ANIMATION_DURATION / roundsData.length;

        var gameState = {
            wormPathSegments: {},
            players: this.props.players.map(pc => ({ id: pc.id })),
            gameEvents: [],
            powerUpEvents: [],
            gameTime: ANIMATION_DURATION,
            map: gameStateFunctions.createMapRectangle("ScoreGraph", WIDTH + 2*MARGIN_X, HEIGHT + 2*MARGIN_Y)
        };

        for (var i = 0; i < roundsData.length; i++) {
            var roundData = roundsData[i];
            this.props.players.forEach(function (player) {
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

        var thisComponent = this;
        var replayGameHandler = ReplayGameHandler({
            gameState,
            onReplayUpdate: function (replayTime) {
                thisComponent.setState({ renderTime: replayTime });
            },
            onReplayOver: function() {}
        });
        replayGameHandler.start();
        this.setState({ gameState });
    }
});