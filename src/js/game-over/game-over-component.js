import React from "react";

import GameCanvas from "../canvas/game-canvas-component.js";
import Score from "../game/score-component.js";
import {parseEvent, CONTINUE_KEY, ENTER_KEY} from "../key-util.js";
import * as clientConstants from "../constants.js"
import * as scoreUtil from "core/src/core/score/score-util.js";
import {wormColors} from "core/src/core/constants.js";
import * as gameStateFunctions from "core/src/core/game-state-functions.js"
import GameOverlayComponent from "../canvas/overlays/game-overlay-component.js";

export default React.createClass({
    displayName: "Match",
    propType: {
        match: React.PropTypes.object.isRequired,
        overlay: React.PropTypes.object,
        onStartNextGameAction: React.PropTypes.func,
        onReplayAction: React.PropTypes.func,
        onMatchOverAction: React.PropTypes.func
    },
    render: function () {
        var match = this.props.match;
        var roundData = match.matchState.roundsData[match.matchState.roundsData.length - 1];
        var startNextGameButton = this.props.onStartNextGameAction && !match.isMatchOver() ? <button className="btn btn-primary" onClick={this.props.onStartNextGameAction}>Start next game</button> : null;
        var replayButton = this.props.onReplayAction ? <button className="btn btn-secondary" onClick={this.props.onReplayAction}>Watch replay</button> : null;
        var endMatchButton = this.props.onMatchOverAction ? <button className={match.isMatchOver() ? "btn btn-primary" : "btn btn-secondary"} onClick={this.props.onMatchOverAction}>End match</button> : null;

        var roundScore = scoreUtil.calculateRoundScore(roundData.gameState, roundData.gameState.gameTime);
        var sortedScore = scoreUtil.createSortedList(roundScore);

        var roundWinningPlayer = match.matchConfig.players.find((p) => (p.id === sortedScore[0].id));
        return (
            <div className="m-x-3">
                <div className="flex flex-center">
                    <div className="m-b-2">
                        <GameCanvas config={{size: clientConstants.DEFAULT_VISUAL_MAP_SIZES.large}} gameState={roundData.gameState} players={match.matchConfig.players} overlay={this.props.overlay}>
                            <GameOverlayComponent gameState={roundData.gameState} className="canvas-overlay-faded-bg canvas-overlay-text">
                                <div>
                                    <h1>Round winner</h1>
                                    <h1 style={{color: wormColors[roundWinningPlayer.colorId]}}>{roundWinningPlayer.name}</h1>
                                </div>
                            </GameOverlayComponent>
                        </GameCanvas>
                    </div>
                    <div className="m-l-2" style={{width: "290px"}}>
                        <Score gameState={roundData.gameState} players={match.matchConfig.players} startScore={roundData.startScore} maxScore={match.matchConfig.maxScore}/>
                        <div className="m-t-2">
                            <div>
                                {startNextGameButton}
                            </div>
                            <div>
                                {replayButton}
                            </div>
                            <div>
                                {endMatchButton}
                            </div>
                        </div>
                    </div>
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
            if (this.props.onStartNextGameAction && !this.props.match.isMatchOver()) {
                this.props.onStartNextGameAction();
            } else if (this.props.onMatchOverAction && this.props.match.isMatchOver()) {
                this.props.onMatchOverAction();
            }
        }
    }
});
