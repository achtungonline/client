var React = require("react");

var ProgressBar = require("./progress-bar-component.js");
var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var Score = require("./score-component.js");
var GameCanvas = require("./canvas/game-canvas-component.js");
var windowFocusHandler = require("../window-focus-handler.js");

var scoreUtil = require("core/src/core/score/score-util.js");
var clone = require("core/src/core/util/clone.js");

function ReplayControls({ match, replayGame, onStartNextGameAction, onTogglePauseAction, onExitAction }) {
    var game = match.getCurrentGame();

    function getStartNextGameButton() {
        return game && game.isGameOver() && !match.isMatchOver() && onStartNextGameAction ? <button className="btn btn-primary" onClick={onStartNextGameAction}>Start next game</button> : null;
    }

    function getPauseButton() {
        return replayGame.isReplayOver() ? null : <button className="btn btn-secondary" onClick={onTogglePauseAction}>{replayGame.isPaused() ? "Resume" : "Pause"}</button>;
    }

    function getExitButton() {
        var exitClassName = onStartNextGameAction ? "btn btn-secondary" : "btn btn-primary";
        return match.isMatchOver() ? <button className="btn btn-primary" onClick={onExitAction}>Game Over</button> : <button className={exitClassName} onClick={onExitAction}>Exit</button>;
    }

    return (
        <div className="m-t-2">
            <div>
                {getStartNextGameButton()}
            </div>
            <div>
                {getPauseButton()}
            </div>
            <div>
                {getExitButton()}
            </div>
        </div>
    );
}

module.exports = React.createClass({
    displayName: "Replay",
    getInitialState: function () {
        return {
            renderTime: 0,
            roundScore: scoreUtil.getStartScore(this.props.players),
            replayGame: null,
            pausedDueToLostFocus: false
        }
    },
    render: function () {
        var match = this.props.match;
        var replayGame = this.state.replayGame;
        var players = this.props.players;
        var maxScore = this.props.maxScore;
        var gameState = this.props.gameState;
        var renderTime = this.state.renderTime;
        var roundScore = this.state.roundScore;

        return (
            <div className="flex flex-start">
                <div className="m-b-2">
                    <GameCanvas gameState={gameState} playerConfigs={players} renderTime={renderTime}/>
                    <ProgressBar progress={replayGame.getReplayProgress()} onProgressClick={replayGame.setReplayProgress} />
                </div>
                <div className="m-l-2" style={{width: "290px"}}>
                    <Score startScore={this.props.startScore} roundScore={roundScore} players={players} maxScore={maxScore}/>
                    <ReplayControls match={match} replayGame={replayGame} onStartNextGameAction={this.props.onStartNextGameAction} onTogglePauseAction={this.togglePause} onExitAction={this.props.onExitAction}/>
                </div>
            </div>
        );
    },
    componentWillMount: function () {
        this.startReplay();
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    componentWillUnmount: function () {
        this.state.replayGame.stop();
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowBlur);
    },
    startReplay: function () {
        var thisComponent = this;

        var replayGame = ReplayGameHandler({
            gameState: this.props.gameState,
            onReplayUpdate: function (replayTime) {
                thisComponent.setState({ renderTime: replayTime, roundScore: scoreUtil.calculateRoundScore(thisComponent.props.gameState, replayTime)});
            },
            onReplayOver: function() {
                thisComponent.props.onReplayGameOver();
            }
        });

        var roundScore = scoreUtil.getStartScore(this.props.players);

        replayGame.start();
        this.setState({ roundScore, replayGame });
    },
    togglePause: function () {
        if (this.state.replayGame.isPaused()) {
            this.state.replayGame.resume();
        } else {
            this.state.replayGame.pause();
        }
        this.forceUpdate();
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
