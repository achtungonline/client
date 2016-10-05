var React = require("react");

var scoreUtil = require("core/src/core/score/score-util.js");
var wormColors = require("core/src/core/constants.js").wormColors;

var GameCanvas = require("./../canvas/game-canvas-component.js");
var ScoreGraph = require("./score-graph-component.js");
import {parseEvent, CONTINUE_KEY, ENTER_KEY} from "../key-util.js";

module.exports = React.createClass({
    displayName: "MatchOver",
    propTypes: {
        match: React.PropTypes.object.isRequired,
        onRoundClick: React.PropTypes.func.isRequired,
        onRestartAction: React.PropTypes.func.isRequired,
        onExitAction: React.PropTypes.func.isRequired
    },
    render: function () {
        var thisComponent = this;

        var equalScoreCounter = 0;
        var prevScore = -1;
        var index = 0;
        var scoreTableRows = scoreUtil.createSortedList(this.props.match.getCurrentScore()).map(function (playerScore) {
            if (prevScore === playerScore.score) {
                equalScoreCounter++;
            } else {
                equalScoreCounter = 0;
            }
            prevScore = playerScore.score;

            var placement = index + 1 - equalScoreCounter;
            index++;

            var placementElement;
            if (placement === 1) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="svg/gold-trophy.svg" alt="Max score: "/>
            } else if (placement === 2) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="svg/silver-trophy.svg" alt="Max score: "/>
            } else if (placement === 3) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="svg/bronze-trophy.svg" alt="Max score: "/>
            } else {
                placementElement = placement;
            }

            var player = thisComponent.props.match.matchConfig.players.find(function(p) {
                return p.id === playerScore.id;
            });

            return (
                <tr key={player.id}>
                    <td style={{textAlign: "center"}}>{placementElement}</td>
                    <td style={{color: wormColors[player.colorId]}}>{player.name}</td>
                    <td>{playerScore.score}</td>
                </tr>
            )
        });

        var roundElements = this.props.match.matchState.roundsData.map(function (roundData, index) {
            var width = 208;
            var gameState = roundData.gameState;
            var winningPlayerId = scoreUtil.createSortedList(roundData.roundScore)[0].id;
            var winningPlayer = thisComponent.props.match.matchConfig.players.find(function(p) {
                return p.id === winningPlayerId;
            });

            return (
                <div key={index} className="m-x-2 m-b-3 round-replay" style={{width: width}}>
                    <div style={{textAlign: "center"}}><span style={{color: wormColors[winningPlayer.colorId]}}>{winningPlayer.name}</span></div>
                    <div onClick={thisComponent.props.onRoundClick.bind(null, index)}>
                        <div className="round-watch-replay">Watch replay</div>
                        <GameCanvas size="small" gameState={gameState} players={thisComponent.props.match.matchConfig.players}/>
                    </div>
                </div>
            );
        });

        return (
            <div className="m-x-2">
                <div className="flex flex-no-wrap flex-center">
                    <div className="m-b-3 m-r-3 flex flex-column flex-space-between" style={{width: "455px"}}>
                        <table className="table table-score">
                            <tbody>
                            {scoreTableRows}
                            </tbody>
                        </table>
                        <div className="flex flex-space-between">
                            <button className="btn btn-primary" onClick={this.props.onRestartAction}>Restart</button>
                            <button className="btn btn-secondary" onClick={this.props.onExitAction}>Exit</button>
                        </div>
                    </div>
                    <div ref="scoreGraphContainer" className="m-b-3 flex-self-center">
                        <ScoreGraph match={this.props.match} />
                    </div>
                </div>
                <div className="flex flex-center round-replay-elements">
                    {roundElements}
                </div>
            </div>
        );
    },
    componentDidMount: function() {
        document.addEventListener("keyup", this.onKeyUp);
    },
    componentWillUnmount: function () {
        document.removeEventListener("keyup", this.onKeyUp);
    },
    onKeyUp: function(event) {
        var newKey = parseEvent(event);
        if (newKey === CONTINUE_KEY || newKey === ENTER_KEY) {
            this.props.onRestartAction();
        }
    }
});
