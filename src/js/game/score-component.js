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
    render: function () {
        //TODO Refactor
        var thisComponent = this;
        var roundScore = scoreUtil.calculateRoundScore(this.props.gameState, this.getRenderTime());
        var combinedScore = this.props.startScore ? scoreUtil.combineScores(this.props.startScore, roundScore) : roundScore;
        var highestRoundScore = scoreUtil.getHighestScore(roundScore);

        var highestCombinedScore = scoreUtil.getHighestScore(combinedScore);

        var sortedScoreList = scoreUtil.createSortedList(combinedScore);

        function isTie() {
            return sortedScoreList[0].score >= thisComponent.props.maxScore && sortedScoreList[0].score - sortedScoreList[1].score < 2;
        }

        var equalScoreCounter = 0;
        var prevScore = -1;
        var index = 0;
        var scoreTableRows = sortedScoreList.map(function (playerScore) {
            var opacityClassName = roundScore[playerScore.id] === highestRoundScore ? "" : "opacity-25";
            var player = thisComponent.props.players.find(function (p) {
                return p.id === playerScore.id;
            });


            var trophyElement = null;
            if (thisComponent.props.showTrophys) {
                if (prevScore === playerScore.score) {
                    equalScoreCounter++;
                } else {
                    equalScoreCounter = 0;
                }
                prevScore = playerScore.score;

                var placement = index + 1 - equalScoreCounter;
                index++;

                var trophyStyle = {height: "20px", width: "20px"};
                if (placement === 1) {
                    trophyElement = <img style={trophyStyle} src="svg/gold-trophy.svg" alt="Max score: "/>
                } else if (placement === 2) {
                    trophyElement = <img style={trophyStyle} src="svg/silver-trophy.svg" alt="Max score: "/>
                } else if (placement === 3) {
                    trophyElement = <img style={trophyStyle} src="svg/bronze-trophy.svg" alt="Max score: "/>
                } else {
                    trophyElement = null;
                }
            }


            return (
                <tr key={player.id}>
                    <td className={opacityClassName} style={{color: wormColors[player.colorId]}}>{player.name}</td>
                    <td className={opacityClassName}>{playerScore.score}</td>
                    <td className={"round-score " + opacityClassName}>{roundScore[playerScore.id] ? " +" + roundScore[playerScore.id] : ""}</td>
                    {trophyElement ?
                        <td className="col-tie-score">{trophyElement}</td>
                        :
                        <td className="col-tie-score">{isTie() && highestCombinedScore - playerScore.score < 2 ? [<span className="tie" key="tie">TIE</span>, <div key="tie-info" className="tie-info">You need to win by 2 points</div>] : null}</td>
                    }
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
                <table className="table-round-score">
                    <tbody>
                    {scoreTableRows}
                    </tbody>
                </table>
            </div>
        );
    },
    getRenderTime() {
        var renderTime = this.props.renderTime;
        if (typeof renderTime === "function") {
            renderTime = renderTime();
        } else if (renderTime === undefined) {
            renderTime = this.props.gameState.gameTime;
        }
        return renderTime;
    },
    update: function () {
        var renderTime = this.getRenderTime();
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
            // We use setTimeout here because setState otherwise triggers render() synchronously, resulting in a delayed frame.
            setTimeout(() => {
                this.forceUpdate()
            }, 0);
        }
        this._requestId = requestFrame(this.update);
        this._prevRenderTime = renderTime;
    },
    componentWillUnmount: function () {
        window.cancelAnimationFrame(this._requestId);
    },
    componentDidMount() {
        this._gameEventIndex = 0;
        this._prevRenderTime = 0;
        this._requestId = requestFrame(this.update);
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.gameState !== nextProps.gameState) {
            this._gameEventIndex = 0;
            this._prevRenderTime = 0;
            this.setState({roundScore: scoreUtil.getStartScore(this.props.players)})
        }
    }
});