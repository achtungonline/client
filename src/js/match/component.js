var React = require("react");
var LocalGameHandler = require("./local-game/local-game-handler.js");
var clone = require("core/src/core/util/clone.js");
var random = require("core/src/core/util/random.js");

var windowFocusHandler = require("../window-focus-handler.js");

var PlayComponent = require("./playComponent.js");
var ReplayComponent = require("./replayComponent.js");

module.exports = React.createClass({
    displayName: "Match",
    getInitialState: function () {
        return {
            isReplaying: false,
            localGame: null,
            roundStartScore: {score: {}, roundWinners: []},
            pausedDueToLostFocus: false,
            scoreState: {
                score: {},
                roundWinners: []
            }
            //TODO: Might want to have different components for replay and match. Might as in we should...
        }
    },
    render: function () {
        var pausedDueToLostFocusElement = this.state.pausedDueToLostFocus ? <strong>Game lost focus!</strong> : null;

        var match = this.props.match;
        var game = this.state.localGame;
        var startScoreState = this.state.roundStartScore;
        var scoreState = this.state.scoreState;
        var players = this.props.players;

        var replay = null;
        var play = null;
        if (this.state.isReplaying) {
            replay = (
                <ReplayComponent
                    match={match}
                    roundStartScore={startScoreState}
                    gameState={this.state.localGame.gameState}
                    players={players}
                    maxScore={this.props.match.matchState.maxScore}
                    onStartNextGameAction={this.startNextGame}
                    onReplayGameOver={this.stopReplay}
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
                    isPaused={this.state.localGame.isPaused()}
                    onPauseAction={this.pauseGame}
                    onExitAction={this.exitGame}
                    onReplayAction={this.startReplay}
                />
            );
        }

        return (
                <div className="m-x-3">
                    {play}
                    {replay}
                </div>
        );
    },
    componentWillMount: function () {
        this.startNextGame();
    },
    componentWillUnmount: function () {
        //this.state.localGame.off("gameOver", this.onGameOver);
        windowFocusHandler.stopListening();
        this.state.localGame.stop();
        //this.props.match.getCurrentScoreHandler().off(this.props.match.getCurrentScoreHandler().events.SCORE_UPDATED, this.onScoreUpdated);
    },
    pauseGame: function () {
        if (this.state.localGame.isPaused()) {
            this.state.localGame.resume();
        } else {
            this.state.localGame.pause();
        }
        this.forceUpdate();
    },
    exitGame: function () {
        this.props.onMatchOverAction();
    },
    startNextGame: function () {
        var seed = random.generateSeed();
        var game = this.props.match.prepareNextGame(seed);
        var roundStartScore = {};
        roundStartScore.score = clone(this.props.match.matchState.score);
        roundStartScore.roundWinners = this.props.match.matchState.roundWinners.slice();
        this.setState({scoreState: this.props.match.matchState, roundStartScore: roundStartScore});

        var match = this.props.match;
        match.getCurrentScoreHandler().on(match.getCurrentScoreHandler().events.SCORE_UPDATED, this.onScoreUpdated);
        //

        var localGame = LocalGameHandler({game: game, playerConfigs: this.props.players});
        this.setState({localGame: localGame});

        localGame.start();

        localGame.on("gameOver", this.onGameOver);

        this.setState({isReplaying: false});

        windowFocusHandler.startListening();
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    onScoreUpdated: function () {
        this.forceUpdate();
    },
    onGameOver: function () {
        this.props.onGameOver({roundStartScore: this.state.roundStartScore, gameState: this.state.localGame.gameState, roundWinners: this.props.match.matchState.roundWinners[this.props.match.matchState.roundWinners.length-1]});
        windowFocusHandler.stopListening();
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
        this.setState({isReplaying: true});
    },
    stopReplay: function () {
        this.setState({isReplaying: false});
    }
});
