var React = require("react");

var clone = require("core/src/core/util/clone.js");
var random = require("core/src/core/util/random.js");
var scoreUtil = require("core/src/core/score/score-util.js");

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
            renderTime: 0,
            pausedDueToLostFocus: false
        }
    },
    render: function () {
        var match = this.props.match;
        var game = this.state.localGame;
        var players = match.matchConfig.players;
        var roundScore = scoreUtil.calculateRoundScore(game.gameState);
        var pauseButton = <button className="btn btn-primary" onClick={this.togglePause}>{game.isPaused() ? "Resume" : "Pause"}</button>;
        var endGameButton = <button className="btn btn-secondary" onClick={this.state.localGame.stop}>End game</button>;

        return (
            <div className="m-x-3">
                <div className="flex flex-start">
                    <div className="m-b-2">
                        <GameCanvas gameState={game.gameState} players={players} renderTime={this.state.renderTime}/>
                    </div>
                    <div className="m-l-2" style={{width: "290px"}}>
                        <Score match={match} startScore={this.state.startScore} roundScore={roundScore} />
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
        this.createGame();
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    componentWillUnmount: function () {
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

        var thisComponent = this;
        var localGame = LocalGameHandler({
            game,
            players: this.props.match.matchConfig.players,
            onGameUpdated: function () {
                thisComponent.setState({ renderTime: localGame.gameState.gameTime });
            },
            onGameOver: this.onGameOver
        });
        localGame.start();

        this.setState({ localGame: localGame });
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
