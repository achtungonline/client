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
        overlay: React.PropTypes.func,
        onSteeringUpdate: React.PropTypes.func.isRequired,
        onLeaveAction: React.PropTypes.func
    },
    getInitialState: function () {
        var startScore = scoreUtil.getStartScore(this.props.match.matchConfig.players);
        if (this.props.match.matchState.roundsData.length > 0) {
            startScore = this.props.match.matchState.roundsData[this.props.match.matchState.roundsData.length - 1].endScore;
        }
        return {
            gameHandler: null,
            startScore: startScore,
            pausedDueToLostFocus: false
        }
    },
    render: function () {
        var match = this.props.match;
        var players = match.matchConfig.players;
        var roundScore = scoreUtil.calculateRoundScore(this.props.gameState);
        var leaveButton = this.props.onLeaveAction ? <button className="btn btn-secondary" onClick={this.props.onLeaveAction}>Leave game</button> : null;

        return (
            <div className="m-x-3">
                <div className="flex flex-start">
                    <div className="m-b-2">
                        <GameCanvas gameState={this.props.gameState} players={players} renderTime={this.state.gameHandler.getRenderTime} overlay={this.props.overlay}/>
                    </div>
                    <div className="m-l-2" style={{width: "290px"}}>
                        <Score match={match} startScore={this.state.startScore} roundScore={roundScore} />
                        <div className="m-t-2">
                            <div>
                                {leaveButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    componentWillMount: function () {
        var gameHandler = RemoteGameHandler({
            gameState: this.props.gameState
        });
        playerSteeringListener.addKeyListeners({ left: this.props.playerData.left, right: this.props.playerData.right, onSteeringUpdate: this.props.onSteeringUpdate });
        this.setState({gameHandler});
    },
    componentDidMount: function() {
        this.state.gameHandler.start();
    },
    componentWillUnmount: function() {
        playerSteeringListener.removeKeyListeners();
    }
});
