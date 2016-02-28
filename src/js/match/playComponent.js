var React = require("react");

var Score = require("./scoreComponent.js");
var GameCanvasComponent = require("./gameCanvasComponent.js");

function MatchControls({ match, onStartNextGameAction, onPauseAction, onExitAction, onReplayAction }) {
    var game = match.getCurrentGame();
    var matchOverButton = match.isMatchOver() ? <button onClick={onExitAction}>Game Over</button> : null;
    var startNextGameButton = game && game.isGameOver() && !match.isMatchOver() ? <button onClick={onStartNextGameAction}>Start next game</button> : null;
    var pauseButton = game.isGameOver() ? null : <button onClick={onPauseAction}>Pause</button>;
    var exitButton = match.isMatchOver() ? <button onClick={onExitAction}>Game Over</button> : <button onClick={onExitAction}>Exit</button>;
    var replayButton = onReplayAction && game && game.isGameOver() ? <button onClick={onReplayAction}>Watch replay</button> : null;

    return (
        <div>
            {matchOverButton}
            {startNextGameButton}
            {replayButton}
            {pauseButton}
            {exitButton}
        </div>
    );
}

module.exports = React.createClass({
    displayName: "Play",
    render: function () {
        var pausedDueToLostFocusElement = this.state.pausedDueToLostFocus ? <strong>Game lost focus!</strong> : null;

        var match = this.props.match;
        var game = this.props.game;
        var startScoreState = this.props.roundStartScore;
        var scoreState = this.props.scoreState;
        var gameState = game.gameState;
        var players = this.props.players;
        var maxScore = this.props.match.matchState.maxScore;

        return (
            <div>
                {pausedDueToLostFocusElement}
                <MatchControls match={match} onStartNextGameAction={this.props.onStartNextGameAction} onPauseAction={this.props.onPauseAction} onExitAction={this.props.onExitAction} onReplayAction={this.props.onReplayAction} />
                <GameCanvasComponent game={game} players={players} renderBotTrajectories={false} />
                <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore} />
            </div>
        );
    }
});
