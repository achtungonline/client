var React = require("react");

var GameCanvas = require("../canvas/game-canvas-component.js");
var Score = require("../game/score-component.js");

module.exports = React.createClass({
    displayName: "Match",
    propType: {
        match: React.PropTypes.object.isRequired,
        overlay: React.PropTypes.func,
        onStartNextGameAction: React.PropTypes.func,
        onReplayAction: React.PropTypes.func,
        onMatchOverAction: React.PropTypes.func
    },
    render: function () {
        var match = this.props.match;
        var roundData = match.matchState.roundsData[match.matchState.roundsData.length - 1];
        var startNextGameButton = this.props.onStartNextGameAction && !match.isMatchOver() ? <button className="btn btn-primary" onClick={this.props.onStartNextGameAction}>Start next game</button> : null;
        var replayButton = this.props.onReplayAction ? <button className="btn btn-secondary" onClick={this.props.onReplayAction}>Watch replay</button> : null;
        var endMatchButton = this.props.onMatchOverAction ?  <button className={match.isMatchOver() ? "btn btn-primary" : "btn btn-secondary"} onClick={this.props.onMatchOverAction}>End match</button> : null;

        return (
            <div className="m-x-3">
                <div className="flex flex-start">
                    <div className="m-b-2">
                        <GameCanvas gameState={roundData.gameState} players={match.matchConfig.players} renderTime={roundData.gameState.gameTime} overlay={this.props.overlay}/>
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
