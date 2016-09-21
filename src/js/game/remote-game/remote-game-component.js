var React = require("react");

var scoreUtil = require("core/src/core/score/score-util.js");

var GameCanvas = require("../../canvas/game-canvas-component.js");
var Score = require("../score-component.js");
var playerSteeringListener = require("../player-steering-listener.js")();
var RemoteGameHandler = require("./remote-game-handler.js");

module.exports = React.createClass({
    displayName: "Remote Game",
    propType: {
        match: React.PropTypes.object.isRequired,
        playerData: React.PropTypes.object.isRequired,
        gameState: React.PropTypes.object.isRequired,
        socket: React.PropTypes.object.isRequired,
        onGameOverAction: React.PropTypes.func
    },
    getInitialState: function () {
        var startScore = scoreUtil.getStartScore(this.props.match.matchConfig.players);
        if (this.props.match.matchState.roundsData.length > 0) {
            startScore = this.props.match.matchState.roundsData[this.props.match.matchState.roundsData.length - 1].endScore;
        }
        return {
            gameHandler: null,
            startScore: startScore,
            renderTime: 0,
            pausedDueToLostFocus: false
        }
    },
    render: function () {
        var match = this.props.match;
        var players = match.matchConfig.players;
        var roundScore = scoreUtil.calculateRoundScore(this.props.gameState);

        return (
            <div className="m-x-3">
                <div className="flex flex-start">
                    <div className="m-b-2">
                        <GameCanvas gameState={this.props.gameState} players={players} renderTime={this.state.renderTime}/>
                    </div>
                    <div className="m-l-2" style={{width: "290px"}}>
                        <Score match={match} startScore={this.state.startScore} roundScore={roundScore} />
                        <div className="m-t-2">
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    componentWillMount: function () {
        var thisComponent = this;
        var gameHandler = RemoteGameHandler({
            gameState: this.props.gameState,
            onGameUpdated: function(renderTime) {
                thisComponent.setState({renderTime});
            }
        });
        this.props.socket.on("game_update", gameHandler.updateGameState);
        this.props.socket.on("game_over", this.onGameOver);
        var onSteeringUpdate = steering => {
            thisComponent.props.socket.emit("player_steering", {[this.props.playerData.playerId]: steering});
        };
        playerSteeringListener.addKeyListeners({ left: this.props.playerData.left, right: this.props.playerData.right, onSteeringUpdate });
        this.setState({gameHandler});
    },
    componentDidMount: function() {
        this.state.gameHandler.start();
    },
    componentWillUnmount: function() {
        this.props.socket.off("game_update", this.updateGameState);
        this.props.socket.off("game_over", this.onGameOver);
        playerSteeringListener.removeKeyListeners();
    },
    onGameOver: function () {
        this.state.gameHandler.stop();
        this.props.match.addFinishedGameState(this.props.gameState);
        if (this.props.onGameOverAction) {
            this.props.onGameOverAction();
        }
    }
});
