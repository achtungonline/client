var React = require("react");

var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameHistory = require("core/src/core/history/game-history.js");
var clone = require("core/src/core/util/clone.js");
var ScoreHandler = require("core/src/core/score-handler.js");


var Score = require("./scoreComponent.js");
var GameCanvasComponent = require("./gameCanvasComponent.js");

function ReplayControls({ match, replayGame, onStartNextGameAction, onPauseAction, onExitAction }) {
    var game = match.getCurrentGame();
    var startNextGameButton = game && game.isGameOver() && !match.isMatchOver() ? <button className="btn btn-primary" onClick={onStartNextGameAction}>Start next game</button> : null;
    var pauseButton = replayGame.isGameOver() ? null : <button className="btn btn-secondary" onClick={onPauseAction}>{replayGame.isPaused() ? "Resume" : "Pause"}</button>;
    var exitButton = match.isMatchOver() ? <button className="btn btn-primary"onClick={onExitAction}>Game Over</button> : <button className="btn btn-secondary" onClick={onExitAction}>Exit</button>;

    return (
        <div className="m-t-2">
            <div>
                {startNextGameButton}
            </div>
            <div>
                {pauseButton}
            </div>
            <div>
                {exitButton}
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
            <div className="flex flex-center m-t-3">
                <div className="flex flex-start">
                    <GameCanvasComponent game={replayGame} players={players} renderBotTrajectories={false}/>
                    <div className="m-l-2" style={{minWidth: "250px"}}>
                        <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore}/>
                        <ReplayControls match={match} replayGame={replayGame} onStartNextGameAction={this.props.onStartNextGameAction} onPauseAction={this.pauseGame} onExitAction={this.props.onExitAction}/>
                    </div>
                </div>
            </div>
        );
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
        replayScoreState.roundsWon = clone(roundStartScore.roundsWon);
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
