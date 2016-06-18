var React = require("react");

var scoreUtils = require("./../score-utils.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");
var GameCanvasComponent = require("./gameCanvasComponent.js");

function MatchControls({ match, onStartNextGameAction, onPauseAction, onExitAction, onReplayAction }) {
    var game = match.getCurrentGame();
    var matchOverButton = match.isMatchOver() ? <button className="btn" onClick={onExitAction}>Game Over</button> : null;
    var startNextGameButton = game && game.isGameOver() && !match.isMatchOver() ? <button className="btn" onClick={onStartNextGameAction}>Start next game</button> : null;
    var pauseButton = game.isGameOver() ? null : <button className="btn" onClick={onPauseAction}>Pause</button>;
    var exitButton = match.isMatchOver() ? <button className="btn" onClick={onExitAction}>Game Over</button> : <button className="btn" onClick={onExitAction}>Exit</button>;
    var replayButton = onReplayAction && game && game.isGameOver() ? <button className="btn" onClick={onReplayAction}>Watch replay</button> : null;

    return (
        <div className="m-t-2">
            <div>
                {matchOverButton}
            </div>
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


function Score({ startScoreState, scoreState, players, gameState, maxScore }) {
    var scoreTableRows = scoreUtils.sort(players, scoreState).map(function (player) {
        var roundStartScore = startScoreState.score[player.id] || 0;
        var score = scoreState.score[player.id] || 0;
        var thisRoundScore = score - roundStartScore;
        var roundScore = (thisRoundScore ? " +" + thisRoundScore : "");
        var opacity = gameStateFunctions.isPlayerAlive(gameState, player.id) ? 1 : 0.25;

        return (
            <tr key={player.id} style={{color: player.color.hexCode, opacity: opacity}}>
                <td>{player.name}</td>
                <td>{score}</td>
                <td style={{minWidth: "34px"}} >{roundScore}</td>
            </tr>
        )
    });

    return (
        <div>
            <div className="flex flex-center max-score m-b-2">
                <img src="src/css/svg/trophy.svg" alt="Max score: "/>
                <div className="flex-self-center">{maxScore}</div>
            </div>
            <table style={{width: "100%"}}>
                <tbody>
                {scoreTableRows}
                </tbody>
            </table>
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
                    <div className="m-l-1" style={{minWidth: "250px"}}>
                        <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore}/>
                        <MatchControls match={match} onStartNextGameAction={this.props.onStartNextGameAction} onPauseAction={this.props.onPauseAction} onExitAction={this.props.onExitAction} onReplayAction={this.props.onReplayAction}/>
                    </div>
                </div>
            </div>
        );
    }
});
