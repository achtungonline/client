var React = require("react");

var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var clone = require("core/src/core/util/clone.js");
var ScoreHandler = require("core/src/core/score-handler.js");

var Score = require("./scoreComponent.js");
var GameCanvasRenderer = require("./canvas/game-canvas-renderer.js");

function ReplayControls({ match, replayGame, onStartNextGameAction, onPauseAction, onExitAction }) {
    var game = match.getCurrentGame();

    function getStartNextGameButton() {
        return game && game.isGameOver() && !match.isMatchOver() && onStartNextGameAction ? <button className="btn btn-primary" onClick={onStartNextGameAction}>Start next game</button> : null;
    }

    function getPauseButton() {
        return replayGame.isGameOver() ? null : <button className="btn btn-secondary" onClick={onPauseAction}>{replayGame.isPaused() ? "Resume" : "Pause"}</button>;
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
    render: function () {
        var match = this.props.match;
        var replayGame = this.state.replayGame;
        var startScoreState = this.props.roundStartScore;
        var scoreState = this.state.scoreState;
        var gameState = replayGame.gameState;
        var players = this.props.players;
        var maxScore = this.props.maxScore;

        return (
            <div className="flex flex-start">
                <div className="m-b-2">
                    <div ref="gameCanvas"></div>
                </div>
                <div className="m-l-2" style={{minWidth: "300px"}}>
                    <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore}/>
                    <ReplayControls match={match} replayGame={replayGame} onStartNextGameAction={this.props.onStartNextGameAction} onPauseAction={this.pauseGame} onExitAction={this.props.onExitAction}/>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        var gameCanvasRenderer = GameCanvasRenderer({gameState: this.state.replayGame.gameState, playerConfigs: this.props.players});
        this.state.replayGame.on(this.state.replayGame.events.GAME_UPDATED, gameCanvasRenderer.render);
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasRenderer.container);
    },
    componentWillMount: function () {
        this.startReplay();
    },
    componentWillUnmount: function () {
        this.state.replayGame.stop();
        var scoreHandler = this.scoreHandler;
        this.scoreHandler && this.scoreHandler.off(scoreHandler.events.SCORE_UPDATED, this.onScoreUpdated);
    },
    startReplay: function () {
        var gameHistory = this.props.gameHistory;
        var roundStartScore = this.props.roundStartScore;

        var replayGame = ReplayGameHandler(gameHistory);
        var replayScoreState = {};
        replayScoreState.score = clone(roundStartScore.score);
        replayScoreState.roundWinners = roundStartScore.roundWinners.slice();
        var scoreHandler = ScoreHandler({game: replayGame, scoreState: replayScoreState});
        scoreHandler.on(scoreHandler.events.SCORE_UPDATED, this.onScoreUpdated);
        this.scoreHandler = scoreHandler;

        replayGame.on("gameOver", this.props.onReplayGameOver);

        replayGame.start();
        this.setState({scoreState: replayScoreState, replayGame: replayGame});
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
