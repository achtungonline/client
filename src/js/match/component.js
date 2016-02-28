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

var PlayComponent = require("./playComponent.js");
var ReplayComponent = require("./replayComponent.js");

module.exports = React.createClass({
    displayName: "Match",
    getInitialState: function () {
        return {
            isReplaying: false,
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

        var match = this.props.match;
        var game = this.state.localGame;
        var startScoreState = this.state.roundStartScore;
        var scoreState = this.state.scoreState;
        var players = this.props.players;

        var play;
        var replay;
        if (this.state.isReplaying) {
            var replay = (
                <ReplayComponent
                    match={match}
                    roundStartScore={startScoreState}
                    gameHistory={this.state.gameHistory}
                    players={players}
                    maxScore={this.props.match.matchState.maxScore}
                    onStartNextGameAction={this.startNextGame}
                    onPauseAction={this.pauseGame}
                    onExitAction={this.exitGame}
                />
            );
        } else {
            play = (
                <PlayComponent
                    game={game}
                    match={match}
                    players={players}
                    scoreState={scoreState}
                    roundStartScore={startScoreState}
                    onStartNextGameAction={this.startNextGame}
                    onPauseAction={this.pauseGame}
                    onExitAction={this.exitGame}
                    onReplayAction={this.startReplay}
                />
            );
        }

        return (
            <div>
                {play}
                {replay}
            </div>
        );
    },
    componentWillMount: function () {
        this.startNextGame();
    },
    componentDidMount: function () {

    },
    componentWillUnmount: function () {
        this.state.localGame.off("gameOver", this.onGameOver);
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowFocus);
        this.props.match.getCurrentScoreHandler().off(this.props.match.getCurrentScoreHandler().events.SCORE_UPDATED, this.onScoreUpdated);
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
        match.getCurrentScoreHandler().on(match.getCurrentScoreHandler().events.SCORE_UPDATED, this.onScoreUpdated);

        function startGameHistoryRecording(game) {
            var gameHistory = GameHistory(game.gameState.map, thisComponent.props.matchConfig.playerConfigs, game.gameState.seed);
            thisComponent.setState({gameHistory: gameHistory});
            GameHistoryHandler().recordGameHistory(game, gameHistory);
        }

        startGameHistoryRecording(game);

        var localGame = LocalGameHandler({game: game, playerConfigs: this.props.players});
        this.setState({localGame: localGame});

        localGame.start();

        localGame.on("gameOver", this.onGameOver);

        this.setState({ isReplaying: false });

        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    onScoreUpdated: function () {
        this.forceUpdate();
    },
    onGameOver: function () {
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowFocus);
        // So that the startNextGameButton shows
        this.forceUpdate();
    },
    onWindowFocus: function () {
        var thisComponent = this;
        setTimeout(function () {
            thisComponent.setState({
                pausedDueToLostFocus: false
            });
            thisComponent.state.localGame.resume();
        }, 1000);
    },
    onWindowBlur: function () {
        this.setState({
            pausedDueToLostFocus: true
        });
        this.pause();
    },
    startReplay: function () {
        this.setState({ isReplaying: true });
        // var thisComponent = this;
        // var replayGame = ReplayGameHandler(this.state.gameHistory);
        // var replayScoreState = {};
        // replayScoreState.score = clone(this.state.roundStartScore.score);
        // replayScoreState.roundsWon = clone(this.state.roundStartScore.roundsWon);
        // var scoreHandler = ScoreHandler({game: replayGame, scoreState: replayScoreState});
        // this.setState({scoreState: replayScoreState, localGame: replayGame});
        // console.log(replayScoreState);
        // scoreHandler.on(scoreHandler.events.SCORE_UPDATED, function () {
        //     thisComponent.forceUpdate();
        // });
        // replayGame.start();
        // this.forceUpdate();
    }
});
