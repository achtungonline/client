var React = require("react");

var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var Score = require("./scoreComponent.js");
var GameCanvasRenderer = require("./canvas/game-canvas-renderer.js");

var scoreUtil = require("core/src/core/score/score-util.js");
var clone = require("core/src/core/util/clone.js");

function ReplayControls({ match, replayGame, onStartNextGameAction, onPauseAction, onExitAction }) {
    var game = match.getCurrentGame();

    function getStartNextGameButton() {
        return game && game.isGameOver() && !match.isMatchOver() && onStartNextGameAction ? <button className="btn btn-primary" onClick={onStartNextGameAction}>Start next game</button> : null;
    }

    function getPauseButton() {
        return replayGame.isReplayOver() ? null : <button className="btn btn-secondary" onClick={onPauseAction}>{replayGame.isPaused() ? "Resume" : "Pause"}</button>;
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

var ProgressBar = React.createClass({
    render: function () {
        return (
            <div className="progress-bar">
                <div className="progress-bar-meter" style={{width: (100*this.props.progress) + "%"}}/>
            </div>
        );
    },
});

module.exports = React.createClass({
    displayName: "Replay",
    getInitialState: function () {
        return {
            roundScore: scoreUtil.getStartScore(this.props.players)
        }
    },
    render: function () {
        var match = this.props.match;
        var replayGame = this.state.replayGame;
        var players = this.props.players;
        var maxScore = this.props.maxScore;

        return (
            <div className="flex flex-start">
                <div className="m-b-2">
                    <div ref="gameCanvas"></div>
                    <ProgressBar ref="progressBar" progress={replayGame.getReplayProgress()} />
                </div>
                <div className="m-l-2" style={{width: "290px"}}>
                    <Score startScore={this.props.startScore} roundScore={this.state.roundScore} players={players} maxScore={maxScore}/>
                    <ReplayControls match={match} replayGame={replayGame} onStartNextGameAction={this.props.onStartNextGameAction} onPauseAction={this.pauseGame} onExitAction={this.props.onExitAction}/>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(this.state.gameCanvasRenderer.container);
    },
    componentWillMount: function () {
        this.startReplay();
    },
    componentWillUnmount: function () {
        this.state.replayGame.stop();
    },
    startReplay: function () {
        var thisComponent = this;

        var gameCanvasRenderer = GameCanvasRenderer({gameState: this.props.gameState, playerConfigs: this.props.players});
        var replayGame = ReplayGameHandler({
            gameState: this.props.gameState,
            onReplayUpdate: function (replayTime) {
                gameCanvasRenderer.render({
                    renderTime: replayTime
                });
                thisComponent.setState({ roundScore: scoreUtil.calculateRoundScore(thisComponent.props.gameState, replayTime)});
            },
            onReplayOver: this.props.onReplayGameOver
        });

        var roundScore = scoreUtil.getStartScore(this.props.players);

        replayGame.start();
        this.setState({ roundScore, replayGame, gameCanvasRenderer });
    },
    pauseGame: function () {
        if (this.state.replayGame.isPaused()) {
            this.state.replayGame.resume();
        } else {
            this.state.replayGame.pause();
        }
        this.forceUpdate();
    },
    onScoreUpdated: function () {
        this.forceUpdate();
    }
});
