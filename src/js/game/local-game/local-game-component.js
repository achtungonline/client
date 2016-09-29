var React = require("react");

var clone = require("core/src/core/util/clone.js");
var random = require("core/src/core/util/random.js");
var scoreUtil = require("core/src/core/score/score-util.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");

var playerSteeringListener = require("../player-steering-listener.js")();
var windowFocusHandler = require("../../window-focus-handler.js");
var LocalGameHandler = require("./local-game-handler.js");
var GameCanvas = require("../../canvas/game-canvas-component.js");
var Score = require("../score-component.js");

module.exports = React.createClass({
    displayName: "Local Game",
    propType: {
        match: React.PropTypes.object.isRequired,
        onGameOverAction: React.PropTypes.func
    },
    getInitialState: function () {
        var startScore = scoreUtil.getStartScore(this.props.match.matchConfig.players);
        if (this.props.match.matchState.roundsData.length > 0) {
            startScore = this.props.match.matchState.roundsData[this.props.match.matchState.roundsData.length - 1].endScore;
        }
        return {
            localGame: null,
            startScore: startScore,
            pausedDueToLostFocus: false
        }
    },
    render: function () {
        var match = this.props.match;
        var game = this.state.localGame;
        var players = match.matchConfig.players;
        var pauseButton = <button className="btn btn-primary" onClick={this.togglePause}>{game.isPaused() ? "Resume" : "Pause"}</button>;
        var endGameButton = <button className="btn btn-secondary" onClick={this.endGame}>End game</button>;

        return (
            <div className="m-x-3">
                <div className="flex flex-start">
                    <div className="m-b-2">
                        <GameCanvas gameState={game.gameState} players={players} />
                    </div>
                    <div className="m-l-2" style={{width: "290px"}}>
                        <Score gameState={game.gameState} players={players} startScore={this.state.startScore} maxScore={match.matchConfig.maxScore} />
                        <div className="m-t-2">
                            <div>
                                {pauseButton}
                            </div>
                            <div>
                                {endGameButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    componentWillMount: function () {
        var thisComponent = this;
        this.createGame();
        this.props.match.matchConfig.players.forEach(function (player) {
            if (player.type === "human") {
                var onSteeringUpdate = steering => {
                    gameStateFunctions.setPlayerSteering(thisComponent.state.localGame.gameState, player.id, steering);
                };
                playerSteeringListener.addKeyListeners({ left: player.left, right: player.right, onSteeringUpdate });
            }
        });
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    componentWillUnmount: function () {
        playerSteeringListener.removeKeyListeners();
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowBlur);
    },
    togglePause: function () {
        if (this.state.localGame.isPaused()) {
            this.state.localGame.resume();
        } else {
            this.state.localGame.pause();
        }
        this.forceUpdate();
    },
    createGame: function () {
        var seed = random.generateSeed();
        var game = this.props.match.prepareNextGame(seed);

        var localGame = LocalGameHandler({
            game,
            onGameOver: this.onGameOver
        });
        localGame.start();

        this.setState({ localGame: localGame });
    },
    endGame: function() {
        this.state.localGame.stop();
        this.onGameOver();
    },
    onGameOver: function () {
        this.props.match.addFinishedGameState(this.state.localGame.gameState);
        if (this.props.onGameOverAction) {
            this.props.onGameOverAction();
        }
    },
    onWindowFocus: function () {
        if (this.state.pausedDueToLostFocus) {
            this.state.localGame.resume();
            this.setState({
                pausedDueToLostFocus: false
            });
        }
    },
    onWindowBlur: function () {
        if(!this.state.localGame.isPaused()) {
            this.state.localGame.pause();
            this.setState({
                pausedDueToLostFocus: true
            });
        }
    }
});
