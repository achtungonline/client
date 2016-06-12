var React = require("react");

var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameHistory = require("core/src/core/history/game-history.js");
var clone = require("core/src/core/util/clone.js");
var ScoreHandler = require("core/src/core/score-handler.js");


var Score = require("./scoreComponent.js");
var GameCanvasComponent = require("./gameCanvasComponent.js");

function ReplayControls({ match, onStartNextGameAction, onPauseAction, onExitAction, onReplayAction }) {
    var game = match.getCurrentGame();
    var matchOverButton = match.isMatchOver() ? <button onClick={onExitAction}>Game Over</button> : null;
    var startNextGameButton = game && game.isGameOver() && !match.isMatchOver() ? <button onClick={onStartNextGameAction}>Start next game</button> : null;
    var pauseButton = game.isGameOver() ? null : <button onClick={onPauseAction}>Pause</button>;
    var exitButton = match.isMatchOver() ? <button onClick={onExitAction}>Game Over</button> : <button onClick={onExitAction}>Exit</button>;

    return (
        <div>
            {matchOverButton}
            {startNextGameButton}
            {pauseButton}
            {exitButton}
        </div>
    );
}

module.exports = React.createClass({
    displayName: "Replay",
    render: function () {
        var match = this.props.match;
        var game = this.state.replayGame;
        var startScoreState = this.props.roundStartScore;
        var scoreState = this.state.scoreState;
        var gameState = game.gameState;
        var players = this.props.players;
        var maxScore = this.props.maxScore;

        return (
            <div>
                <ReplayControls match={match} onStartNextGameAction={this.props.onStartNextGameAction} onPauseAction={this.props.onPauseAction} onExitAction={this.props.onExitAction} />
                <GameCanvasComponent game={game} players={players} renderBotTrajectories={false} />
                <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore} />
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

        var thisComponent = this;
        var replayGame = ReplayGameHandler(gameHistory);
        var replayScoreState = {};
        replayScoreState.score = clone(roundStartScore.score);
        replayScoreState.roundsWon = clone(roundStartScore.roundsWon);
        var scoreHandler = ScoreHandler({game: replayGame, scoreState: replayScoreState});
        scoreHandler.on(scoreHandler.events.SCORE_UPDATED, this.onScoreUpdated);
        this.scoreHandler = scoreHandler;
        replayGame.start();
        this.setState({scoreState: replayScoreState, replayGame: replayGame});
    },
    onScoreUpdated: function () {
        this.forceUpdate();
    }
});
