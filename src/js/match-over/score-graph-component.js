import React from "react";

import * as gsf from "core/src/core/game-state-functions.js";
import * as scoreUtil from "core/src/core/score/score-util.js";

import GameCanvas from "../canvas/game-canvas-component.js";
import ReplayGameHandler from "../replay/replay-game-handler.js";

var ANIMATION_DURATION = 0.5;
var WIDTH = 600;
var HEIGHT = 400;
var MARGIN_X = 1.5;
var MARGIN_Y = 0.5;
var BORDER_WIDTH = 4;
var LINE_WIDTH = 1.5;

export default React.createClass({
    propTypes: {
        match: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            replayGame: null
        };
    },
    render: function() {
        var map = this.state.replayGame.gameState.map;
        return (
            <GameCanvas gameState={this.state.replayGame.gameState} players={this.props.match.matchConfig.players} renderTime={this.state.replayGame.getReplayTime} />
        );
    },
    componentWillMount: function() {
        var roundsData = this.props.match.matchState.roundsData;
        var maxScore = Math.max(1, 1.15*scoreUtil.getHighestScore(this.props.match.getCurrentScore()));

        var gameState = {
            wormPathSegments: {},
            players: this.props.match.matchConfig.players.map(p => ({ id: p.id })),
            gameEvents: [],
            powerUpEvents: [],
            effectEvents: [],
            gameTime: ANIMATION_DURATION,
            map: gsf.createMapRectangle({
                name: "ScoreGraph",
                width: WIDTH,
                height: HEIGHT,
                borderWidth: BORDER_WIDTH
            })
        };
        var dx = gameState.map.width / roundsData.length;
        var dy = gameState.map.height / maxScore;
        var dt = ANIMATION_DURATION / roundsData.length;

        for (var i = 0; i < roundsData.length; i++) {
            var roundData = roundsData[i];
            this.props.match.matchConfig.players.forEach(function (player) {
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
                    startX: Math.max(BORDER_WIDTH + MARGIN_X, dx*i),
                    endX: Math.min(gameState.map.width - BORDER_WIDTH - MARGIN_X, + dx*(i+1)),
                    startY: gameState.map.height - BORDER_WIDTH - MARGIN_Y - roundData.startScore[player.id] * dy,
                    endY: gameState.map.height - BORDER_WIDTH - MARGIN_Y - (roundData.startScore[player.id] + roundData.roundScore[player.id]) * dy
                });
            });
        }

        var replayGame = ReplayGameHandler({
            gameState,
            onReplayOver: function() {}
        });
        replayGame.start();
        this.setState({ replayGame });
    }
});