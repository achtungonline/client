var React = require("react");
var GameCanvasComponent = require("./gameCanvasComponent.js");
var Score = require("./scoreComponent.js");

function MatchControls({ match, onStartNextGameAction, isPaused, onPauseAction, onExitAction, onReplayAction }) {
    var game = match.getCurrentGame();
    var startNextGameButton = game && game.isGameOver() && !match.isMatchOver() ? <button className="btn btn-primary" onClick={onStartNextGameAction}>Start next game</button> : null;
    var pauseButton = game.isGameOver() ? null : <button className="btn btn-primary" onClick={onPauseAction}>{isPaused ? "Resume" : "Pause"}</button>;
    var exitButton = match.isMatchOver() ? <button className="btn btn-primary" onClick={onExitAction}>Game Over</button> : <button className="btn btn-secondary" onClick={onExitAction}>Exit</button>;
    var replayButton = onReplayAction && game && game.isGameOver() ? <button className="btn btn-secondary" onClick={onReplayAction}>Watch replay</button> : null;

    return (
        <div className="m-t-2">
            <div>
                {startNextGameButton}
            </div>
            <div>
                {replayButton}
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
    displayName: "Play",
    render: function () {
        var match = this.props.match;
        var game = this.props.game;
        var startScoreState = this.props.roundStartScore;
        var scoreState = this.props.scoreState;
        var gameState = game.gameState;
        var players = this.props.players;
        var maxScore = this.props.match.matchState.maxScore;

        return (
            <div className="flex flex-center m-t-3">
                <div className="flex flex-start">
                    <GameCanvasComponent game={game} players={players} renderBotTrajectories={false}/>
                    <div className="m-l-1 m-t-2" style={{minWidth: "250px"}}>
                        <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore}/>
                        <MatchControls match={match} onStartNextGameAction={this.props.onStartNextGameAction} isPaused={this.props.isPaused} onPauseAction={this.props.onPauseAction} onExitAction={this.props.onExitAction} onReplayAction={this.props.onReplayAction}/>
                    </div>
                </div>
            </div>
        );
    }
});
