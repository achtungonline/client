var React = require("react");
var GameCanvasHandler = require("./canvas/game-canvas-handler.js");
var LocalGameHandler = require("./local-game/local-game-handler.js");
var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameHistory = require("core/src/core/history/game-history.js");
var ScoreHandler = require("core/src/core/score-handler.js");
var clone = require("core/src/core/util/clone.js");
var random = require("core/src/core/util/random.js");

var FPS = require("./fps-component.js");
var scoreUtils = require("./../score-utils.js");
var windowFocusHandler = require("../window-focus-handler.js");

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
    displayName: "Match",
    getInitialState: function () {
        return {
            localGame: null,
            gameHistory: null,
            roundStartScore: {score: {}, roundsWon: {}},
            pausedDueToLostFocus: false,
            scoreState: {
                score: {},
                roundsWon: {}
            } //TODO: Might want to have different components for replay and match. Might as in we should...
        }
    },
    render: function () {
        var pausedDueToLostFocusElement = this.state.pausedDueToLostFocus ? <strong>Game lost focus!</strong> : null;

        var startScoreState = this.state.roundStartScore;
        var scoreState = this.state.scoreState;
        var gameState = this.state.localGame.gameState;
        var players = this.props.players;
        var maxScore = this.props.match.matchState.maxScore;

        return (
            <div>
                {pausedDueToLostFocusElement}
                <MatchControls match={this.props.match} onStartNextGameAction={this.startNextGame} onPauseAction={this.pauseGame} onExitAction={this.exitGame} onReplayAction={this.startReplay} />
                <GameCanvasComponent game={this.state.localGame} players={this.props.players} renderBotTrajectories={false} />
                <Score startScoreState={startScoreState} scoreState={scoreState} gameState={gameState} players={players} maxScore={maxScore} />
            </div>
        );
    },
    componentWillMount: function () {
        this.startNextGame();
    },
    componentDidMount: function () {
    },
    pauseGame: function () {
        if (this.state.localGame.isPaused()) {
            this.state.localGame.resume();
        } else {
            this.state.localGame.pause();
        }
    },
    exitGame: function () {
        this.props.onMatchOverAction();
    },
    startNextGame: function () {
        var thisComponent = this;
        var seed = random.generateSeed();
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
        this.setState({localGame: localGame});

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
        var replayScoreState = {};
        replayScoreState.score = clone(this.state.roundStartScore.score);
        replayScoreState.roundsWon = clone(this.state.roundStartScore.roundsWon);
        var scoreHandler = ScoreHandler({game: replayGame, scoreState: replayScoreState});
        this.setState({scoreState: replayScoreState, localGame: replayGame});
        console.log(replayScoreState);
        scoreHandler.on(scoreHandler.events.SCORE_UPDATED, function () {
            thisComponent.forceUpdate();
        });
        replayGame.start();
        this.forceUpdate();
    }
});
