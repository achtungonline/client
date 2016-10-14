import React from "react";

import * as scoreUtil from "core/src/core/score/score-util.js";
import clone from "core/src/core/util/clone.js";

import ProgressBar from "./progress-bar-component.js";
import ReplayGameHandler from "./replay-game-handler.js";
import Score from "../game/score-component.js";
import GameCanvas from "./../canvas/game-canvas-component.js";
import * as windowFocusHandler from "../window-focus-handler.js";
import {parseEvent, CONTINUE_KEY} from "../key-util.js";

export default React.createClass({
    displayName: "Replay",
    propTypes: {
        match: React.PropTypes.object.isRequired,
        roundId: React.PropTypes.number.isRequired,
        overlay: React.PropTypes.object,
        onReplayOver: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            roundData: this.props.match.matchState.roundsData[this.props.roundId],
            replayGame: null,
            pausedDueToLostFocus: false,
            pausedByButton: false
        }
    },
    render: function () {
        var match = this.props.match;
        var replayGame = this.state.replayGame;

        this.props.overlay.setPaused(replayGame.isPaused());
        var pauseButton = replayGame.isReplayOver() ? null : <button className="btn btn-secondary" onClick={this.buttonTogglePause}>{replayGame.isPaused() ? "Resume" : "Pause"}</button>;
        var endReplayButton = <button className="btn btn-primary" onClick={this.state.replayGame.stop}>End replay</button>;

        return (
            <div className="flex flex-center">
                <div className="m-b-2 replay-container">
                    <GameCanvas size="large" gameState={this.state.roundData.gameState} players={match.matchConfig.players} renderTime={replayGame.getReplayTime} overlay={this.props.overlay}/>
                    <ProgressBar progress={replayGame.getReplayProgress} onTogglePause={this.progressBarTogglePause} onProgressChange={replayGame.setReplayProgress} />
                </div>
                <div className="m-l-2" style={{width: "290px"}}>
                    <Score gameState={this.state.roundData.gameState} players={match.matchConfig.players} renderTime={replayGame.getReplayTime} startScore={this.state.roundData.startScore} maxScore={match.matchConfig.maxScore} />
                    <div className="m-t-2">
                        <div>
                            {pauseButton}
                        </div>
                        <div>
                            {endReplayButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    componentWillMount: function () {
        this.startReplay();
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    componentDidMount: function() {
        document.addEventListener("keyup", this.onKeyUp);
    },
    componentWillUnmount: function () {
        this.state.replayGame.stop();
        document.removeEventListener("keyup", this.onKeyUp);
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowBlur);
    },
    onKeyUp: function(event) {
        var newKey = parseEvent(event);
        if (newKey === CONTINUE_KEY) {
            this.buttonTogglePause();
        }
    },
    startReplay: function () {
        var thisComponent = this;

        var replayGame = ReplayGameHandler({
            gameState: this.state.roundData.gameState,
            onReplayOver: function() {
                thisComponent.props.onReplayOver();
            }
        });

        var roundScore = scoreUtil.getStartScore(this.props.match.matchConfig.players);

        replayGame.start();
        this.setState({ roundScore, replayGame });
    },
    buttonTogglePause: function () {
        if (this.state.replayGame.isPaused()) {
            this.state.replayGame.resume();
            this.setState({ pausedByButton: false });
        } else {
            this.state.replayGame.pause();
            this.setState({ pausedByButton: true });
        }
    },
    progressBarTogglePause: function() {
        if (!this.state.pausedByButton) {
            if (this.state.replayGame.isPaused()) {
                this.state.replayGame.resume();
            } else {
                this.state.replayGame.pause();
            }
            this.forceUpdate();
        }
    },
    onWindowFocus: function () {
        if (this.state.pausedDueToLostFocus) {
            this.state.replayGame.resume();
            this.setState({
                pausedDueToLostFocus: false
            });
        }
    },
    onWindowBlur: function () {
        if(!this.state.replayGame.isPaused()) {
            this.state.replayGame.pause();
            this.setState({
                pausedDueToLostFocus: true
            });
        }
    },
    onScoreUpdated: function () {
        this.forceUpdate();
    }
});
