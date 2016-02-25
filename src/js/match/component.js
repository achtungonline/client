var React = require('react');
var GameCanvasHandler = require('./canvas/game-canvas-handler.js');
var LocalGameHandler = require('./local-game/local-game-handler.js');
var ReplayGameHandler = require('./local-game/replay/replay-game-handler.js');
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameHistory = require("core/src/core/history/game-history.js");
var ScoreHandler = require("core/src/core/score-handler.js");
var clone = require("core/src/core/util/clone.js");

var FPS = require("./fps-component.js");
var scoreUtils = require("./../score-utils.js");
var windowFocusHandler = require("../window-focus-handler.js");

module.exports = React.createClass({
    displayName: 'Match',
    getInitialState: function () {
        return {
            gameHistory: null,
            roundStartScore: null,
            pausedDueToLostFocus: false,
            scoreState: {
                score: {},
                roundsWon: {}
            } //TODO: Might want to have different components for replay and match. Might as in we should...
        }
    },
    render: function () {
        var thisComponent = this;
        var currentGame = this.props.match.getCurrentGame();
        var matchOverButton = this.props.match.isMatchOver() ? <button onClick={thisComponent.props.onMatchOverAction}>Game Over</button> : null;
        var startNextGameButton = currentGame && currentGame.isGameOver() && !this.props.match.isMatchOver() ? <button onClick={this.startNextGame}>Start next game</button> : null;
        var replayButton = currentGame && currentGame.isGameOver() && this.state.gameHistory ? <button onClick={this.startReplay}>Watch replay</button> : null;
        var pausedDueToLostFocusElement = this.state.pausedDueToLostFocus ? <strong>Game lost focus!</strong> : null;

        var scoreTableRows = scoreUtils.sort(this.props.players, this.state.scoreState).map(function (player) {
            return (
                <tr key={player.id} style={{color: player.color.hexCode}}>
                    <td>{player.name}</td>
                    <td>{thisComponent.state.scoreState.score[player.id] || 0}</td>
                </tr>
            )
        });

        return (
            <div>
                {matchOverButton}
                {startNextGameButton}
                {replayButton}
                {pausedDueToLostFocusElement}
                <div ref="gameCanvas"></div>
                <table>
                    <tbody>
                    {scoreTableRows}
                    </tbody>
                </table>
                <div>Max score: {this.props.match.matchState.maxScore}</div>
            </div>
        );
    },
    componentDidMount: function () {
        this.startNextGame();
    },
    startNextGame: function () {
        var thisComponent = this;
        var seed = Math.random();
        var game = this.props.match.prepareNextGame(seed);
        var roundStartScore = {};
        roundStartScore.score = clone(this.props.match.matchState.score);
        roundStartScore.roundsWon = clone(this.props.match.matchState.roundsWon);
        this.setState({scoreState: this.props.match.matchState, roundStartScore: roundStartScore});

        var match = this.props.match;
        match.getCurrentScoreHandler().on(match.getCurrentScoreHandler().events.SCORE_UPDATED, function () {
            thisComponent.forceUpdate();
        });

        function startGameHistoryRecording(game) {
            var gameHistory = GameHistory(game.gameState.map, thisComponent.props.matchConfig.playerConfigs, game.gameState.seed);
            thisComponent.setState({gameHistory: gameHistory});
            GameHistoryHandler().recordGameHistory(game, gameHistory);
        }

        startGameHistoryRecording(game);

        var localGame = LocalGameHandler({game: game, playerConfigs: this.props.players});

        function onWindowFocus() {
            setTimeout(function () {
                thisComponent.setState({
                    pausedDueToLostFocus: false
                });
                localGame.resume();
            }, 1000);
        }

        function onWindowBlur() {
            thisComponent.setState({
                pausedDueToLostFocus: true
            });
            localGame.pause();
        }

        windowFocusHandler.on("focus", onWindowFocus);
        windowFocusHandler.on("blur", onWindowBlur);

        this.prepareGameForCanvas(localGame);
        localGame.start();

        localGame.on("gameOver", function (phaseType) {
            windowFocusHandler.off("focus", onWindowFocus);
            windowFocusHandler.off("blur", onWindowFocus);
            // So that the startNextGameButton shows
            thisComponent.forceUpdate();
        });
        thisComponent.forceUpdate();
    },
    startReplay: function () {
        var thisComponent = this;
        var replayGame = ReplayGameHandler(this.state.gameHistory);
        this.prepareGameForCanvas(replayGame);
        var replayScoreState = {};
        replayScoreState.score = clone(this.state.roundStartScore.score);
        replayScoreState.roundsWon = clone(this.state.roundStartScore.roundsWon);
        var scoreHandler = ScoreHandler({game: replayGame, scoreState: replayScoreState});
        this.setState({scoreState: replayScoreState});
        console.log(replayScoreState);
        scoreHandler.on(scoreHandler.events.SCORE_UPDATED, function () {
            thisComponent.forceUpdate();
        });
        replayGame.start();
        this.forceUpdate();
    },
    prepareGameForCanvas: function (game) {
        var gameCanvasHandler = GameCanvasHandler({game: game, playerConfigs: this.props.players});
        var gameCanvasContainer = gameCanvasHandler.getGameCanvasContainer();
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasContainer);
    }
});
