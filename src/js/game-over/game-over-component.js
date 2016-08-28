var React = require("react");

var GameCanvas = require("../canvas/game-canvas-component.js");
var Score = require("../game/score-component.js");

module.exports = React.createClass({
    displayName: "Match",
    propType: {
        match: React.PropTypes.object.isRequired,
        onStartNextGameAction: React.PropTypes.func,
        onReplayAction: React.PropTypes.func.isRequired,
        onMatchOverAction: React.PropTypes.func.isRequired
    },
    render: function () {
        var match = this.props.match;
        var roundData = match.matchState.roundsData[match.matchState.roundsData.length - 1];
        var startNextGameButton = !match.isMatchOver() ? <button className="btn btn-primary" onClick={this.props.onStartNextGameAction}>Start next game</button> : null;
        var replayButton = <button className="btn btn-secondary" onClick={this.props.onReplayAction}>Watch replay</button>;
        var endMatchButton =  <button className={match.isMatchOver() ? "btn btn-primary" : "btn btn-secondary"} onClick={this.props.onMatchOverAction}>End match</button>;

        return (
            <div className="m-x-3">
                <div className="flex flex-start">
                    <div className="m-b-2">
                        <GameCanvas gameState={roundData.gameState} players={match.matchConfig.players} />
                    </div>
                    <div className="m-l-2" style={{width: "290px"}}>
                        <Score match={match} startScore={roundData.startScore} roundScore={roundData.roundScore} />
                        <div className="m-t-2">
                            <div>
                                {startNextGameButton}
                            </div>
                            <div>
                                {replayButton}
                            </div>
                            <div>
                                {endMatchButton}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});