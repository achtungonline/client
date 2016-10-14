import React from "react";

import requestFrame from "./request-frame.js";

import * as scoreUtil from "core/src/core/score/score-util.js";
import {wormColors} from "core/src/core/constants.js";

export default React.createClass({
    propTypes: {
        gameState: React.PropTypes.object.isRequired,
        players: React.PropTypes.array.isRequired,
        renderTime: React.PropTypes.any,
        startScore: React.PropTypes.object,
        maxScore: React.PropTypes.number
    },
    getInitialState: function() {
        return {
            roundScore: scoreUtil.getStartScore(this.props.players)
        };
    },
    render: function() {
        var thisComponent = this;
        var roundScore = this.state.roundScore;
        var combinedScore = this.props.startScore ? scoreUtil.combineScores(this.props.startScore, roundScore) : roundScore;
        var highestRoundScore = scoreUtil.getHighestScore(roundScore);

        var scoreTableRows = scoreUtil.createSortedList(combinedScore).map(function (playerScore) {
            var opacity = roundScore[playerScore.id] === highestRoundScore ? 1 : 0.25;
            var player = thisComponent.props.players.find(function(p) {
                return p.id === playerScore.id;
            });

            return (
                <tr key={player.id} style={{opacity: opacity}}>
                    <td style={{color: wormColors[player.colorId]}}>{player.name}</td>
                    <td>{playerScore.score}</td>
                    <td style={{minWidth: "34px"}}>{roundScore[playerScore.id] ? " +" + roundScore[playerScore.id] : ""}</td>
                </tr>
            )
        });
        var maxScoreDiv;
        if (this.props.maxScore) {
            maxScoreDiv =
                <div className="flex flex-center max-score m-b-2">
                    <img src="svg/trophy.svg" alt="Max score: "/>
                    <div className="flex-self-center">{this.props.maxScore}</div>
                </div>;
        }

        return (
            <div>
                {maxScoreDiv}
                <table style={{width: "100%"}}>
                    <tbody>
                    {scoreTableRows}
                    </tbody>
                </table>
            </div>
        );
    },
    update: function() {
        var renderTime = this.props.renderTime;
        if (typeof renderTime === "function") {
            renderTime = renderTime();
        } else if (renderTime === undefined) {
            renderTime = this.props.gameState.gameTime;
        }
        var gameState = this.props.gameState;
        var shouldUpdate = false;
        if (renderTime < this._prevRenderTime) {
            this._gameEventIndex = 0;
            shouldUpdate = true;
        }
        while (this._gameEventIndex < gameState.gameEvents.length) {
            var gameEvent = gameState.gameEvents[this._gameEventIndex];
            if (gameEvent.time <= renderTime) {
                if (gameEvent.type === "player_died") {
                    shouldUpdate = true;
                }
                this._gameEventIndex++;
            } else {
                break;
            }
        }
        if (shouldUpdate) {
            var roundScore = scoreUtil.calculateRoundScore(gameState, renderTime);
            // We use setTimeout here because setState otherwise triggers render() synchronously, resulting in a delayed frame.
            setTimeout(() => this.setState({ roundScore }), 0);
        }
        this._requestId = requestFrame(this.update);
        this._prevRenderTime = renderTime;
    },
    componentWillUnmount: function() {
        window.cancelAnimationFrame(this._requestId);
    },
    componentDidMount() {
        this._gameEventIndex = 0;
        this._prevRenderTime = 0;
        this._requestId = requestFrame(this.update);
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.gameState !== nextProps.gameState) {
            this._gameEventIndex = 0;
            this._prevRenderTime = 0;
            this.setState({ roundScore: scoreUtil.getStartScore(this.props.players) })
        }
    }
});