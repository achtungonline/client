var React = require("react");
var scoreUtil = require("core/src/core/score/score-util.js");

var GameCanvasRenderer = require("./canvas/game-canvas-renderer.js");
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
    getInitialState: function () {
        return {
            roundScore: scoreUtil.getStartScore(this.props.players)
        }
    },
    render: function () {
        var match = this.props.match;
        var game = this.props.game;
        var gameState = game.gameState;
        var players = this.props.players;
        var maxScore = this.props.match.matchState.maxScore;
        var roundScore = scoreUtil.calculateRoundScore(gameState);

        return (
            <div className="flex flex-start">
                <div className="m-b-2">
                    <div ref="gameCanvas"></div>
                </div>
                <div className="m-l-2" style={{width: "290px"}}>
                    <Score startScore={this.props.startScore} roundScore={roundScore} players={players} maxScore={maxScore}/>
                    <MatchControls match={match} onStartNextGameAction={this.props.onStartNextGameAction} isPaused={this.props.isPaused} onPauseAction={this.props.onPauseAction} onExitAction={this.props.onExitAction} onReplayAction={this.props.onReplayAction}/>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        var thisComponent = this;
        var gameCanvasRenderer = GameCanvasRenderer({gameState: this.props.game.gameState, playerConfigs: this.props.players});
        gameCanvasRenderer.render();
        this.props.game.on(this.props.game.events.GAME_UPDATED, function() {
            gameCanvasRenderer.render();
            thisComponent.setState({roundScore: scoreUtil.calculateRoundScore(thisComponent.props.game.gameState)});
        });
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasRenderer.container);
    },
    componentDidUpdate: function (prevProps) {
        if (this.props.game !== prevProps.game) {
            this.componentDidMount();
        }
    }
});
