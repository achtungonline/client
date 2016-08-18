var React = require("react");
var LocalGameHandler = require("./local-game/local-game-handler.js");
var clone = require("core/src/core/util/clone.js");
var random = require("core/src/core/util/random.js");
var scoreUtil = require("core/src/core/score/score-util.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");

var windowFocusHandler = require("../window-focus-handler.js");

var PlayComponent = require("./playComponent.js");
var ReplayComponent = require("./replayComponent.js");

module.exports = React.createClass({
    displayName: "Match",
    getInitialState: function () {
        return {
            isReplaying: false,
            localGame: null,
            startScore: scoreUtil.getStartScore(this.props.players),
            pausedDueToLostFocus: false
            //TODO: Might want to have different components for replay and match. Might as in we should...
        }
    },
    render: function () {
        var pausedDueToLostFocusElement = this.state.pausedDueToLostFocus ? <strong>Game lost focus!</strong> : null;

        var match = this.props.match;
        var game = this.state.localGame;
        var startScore = this.state.startScore;
        var players = this.props.players;

        var replay = null;
        var play = null;
        if (this.state.isReplaying) {
            replay = (
                <ReplayComponent
                    match={match}
                    startScore={startScore}
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
                    startScore={startScore}
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
        windowFocusHandler.stopListening();
        this.state.localGame.stop();
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
        if (this.state.localGame !== null) {
            // Not the first game. Use score from previous game
            var roundScore = scoreUtil.calculateRoundScore(this.state.localGame.gameState);
            var startScore = scoreUtil.combineScores(this.state.startScore, roundScore);
            this.setState({ startScore });
        }


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
        var roundScore = scoreUtil.calculateRoundScore(this.state.localGame.gameState);
        var replayGameState = gameStateFunctions.extractReplayGameState(this.state.localGame.gameState);
        this.props.onGameOver({startScore: this.state.startScore, roundScore, gameState: replayGameState});
        windowFocusHandler.stopListening();
        // So that the startNextGameButton shows
        this.forceUpdate();
    },
    onWindowFocus: function () {
        //var thisComponent = this;
        //setTimeout(function () {
        //    thisComponent.setState({
        //        pausedDueToLostFocus: false
        //    });
        //    this.pauseGame();
        //}, 1000);
    },
    onWindowBlur: function () {
        this.setState({
            pausedDueToLostFocus: true
        });
        if(!this.state.localGame.isPaused()) {
            this.pauseGame();
        }
    },
    startReplay: function () {
        this.setState({isReplaying: true});
    },
    stopReplay: function () {
        this.setState({isReplaying: false});
    }
});
