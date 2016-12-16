import React from "react";

import * as scoreUtil from "core/src/core/score/score-util.js";
import {wormColors} from "core/src/core/constants.js";

import GameCanvas from "./../canvas/game-canvas-component.js";
import ScoreGraph from "./score-graph-component.js";
import {parseEvent, CONTINUE_KEY, ENTER_KEY} from "../key-util.js";
import * as clientConstants from "../constants.js"
import GameOverlayComponent from "../canvas/overlays/game-overlay-component.js";

export default React.createClass({
    displayName: "MatchOver",
    propTypes: {
        match: React.PropTypes.object.isRequired,
        onRoundClick: React.PropTypes.func.isRequired,
        onRestartAction: React.PropTypes.func.isRequired,
        onExitAction: React.PropTypes.func.isRequired
    },
    render: function () {
        var thisComponent = this;

        var equalScoreCounter = 0;
        var prevScore = -1;
        var index = 0;
        var scoreTableRows = scoreUtil.createSortedList(this.props.match.getCurrentScore()).map(function (playerScore) {
            if (prevScore === playerScore.score) {
                equalScoreCounter++;
            } else {
                equalScoreCounter = 0;
            }
            prevScore = playerScore.score;

            var placement = index + 1 - equalScoreCounter;
            index++;

            var placementElement;
            if (placement === 1) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="svg/gold-trophy.svg" alt="Max score: "/>
            } else if (placement === 2) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="svg/silver-trophy.svg" alt="Max score: "/>
            } else if (placement === 3) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="svg/bronze-trophy.svg" alt="Max score: "/>
            } else {
                placementElement = placement;
            }

            var player = thisComponent.props.match.matchConfig.players.find(function (p) {
                return p.id === playerScore.id;
            });

            return (
                <tr key={player.id}>
                    <td style={{textAlign: "center"}}>{placementElement}</td>
                    <td style={{color: wormColors[player.colorId]}}>{player.name}</td>
                    <td>{playerScore.score}</td>
                </tr>
            )
        });

        var roundElements = this.props.match.matchState.roundsData.map(function (roundData, index) {
            var width = 208;
            var gameState = roundData.gameState;
            var winningPlayerId = scoreUtil.createSortedList(roundData.roundScore)[0].id;
            var winningPlayer = thisComponent.props.match.matchConfig.players.find(function (p) {
                return p.id === winningPlayerId;
            });

            return (
                <div key={index} className="m-x-2 m-b-3 round-replay">
                    <div style={{textAlign: "center"}}><span style={{color: wormColors[winningPlayer.colorId]}}>{winningPlayer.name}</span></div>
                    <div onClick={thisComponent.props.onRoundClick.bind(null, index)} className="canvas-overlay-hover-wrapper match-over-replay">
                        <GameCanvas gameState={gameState} players={thisComponent.props.match.matchConfig.players}>
                            <GameOverlayComponent gameState={gameState} className="canvas-overlay-text opacity-5 canvas-overlay-hover-effect">
                                <h3>Round {index + 1}</h3>
                            </GameOverlayComponent>
                        </GameCanvas>
                    </div>
                </div>
            );
        });

        return (
            <div className="">
                <div className="flex flex-no-wrap m-b-3">
                    <div className="flex flex-column flex-space-between m-r-3" style={{flexBasis: "50%"}}>
                        <table className="table table-score">
                            <tbody>
                            {scoreTableRows}
                            </tbody>
                        </table>
                        <div className="flex flex-space-between">
                            <button className="btn btn-primary" onClick={this.props.onRestartAction}>Restart</button>
                            <button className="btn btn-secondary" onClick={this.props.onExitAction}>Exit</button>
                        </div>
                    </div>
                    <div ref="scoreGraphContainer" style={{flexBasis: "50%"}}>
                        <ScoreGraph match={this.props.match}/>
                    </div>
                </div>
                <div className="flex flex-center round-replay-elements">
                    {roundElements}
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        document.addEventListener("keyup", this.onKeyUp);
    },
    componentWillUnmount: function () {
        document.removeEventListener("keyup", this.onKeyUp);
    },
    onKeyUp: function (event) {
        var newKey = parseEvent(event);
        if (newKey === CONTINUE_KEY || newKey === ENTER_KEY) {
            this.props.onRestartAction();
        }
    }
});
