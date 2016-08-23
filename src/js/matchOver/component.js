var React = require("react");
var scoreUtil = require("core/src/core/score/score-util.js");

var GameCanvas = require("./../match/canvas/game-canvas-component.js");
var ScoreGraph = require("./score-graph-component.js");

module.exports = React.createClass({
    displayName: "MatchOver",
    render: function () {
        var thisComponent = this;

        var equalScoreCounter = 0;
        var prevScore = -1;
        var index = 0;
        var scoreTableRows = scoreUtil.createSortedList(this.props.matchState.score).map(function (playerScore) {
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
                placementElement = <img style={{height: "27px", width: "27px"}} src="src/css/svg/gold-trophy.svg" alt="Max score: "/>
            } else if (placement === 2) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="src/css/svg/silver-trophy.svg" alt="Max score: "/>
            } else if (placement === 3) {
                placementElement = <img style={{height: "27px", width: "27px"}} src="src/css/svg/bronze-trophy.svg" alt="Max score: "/>
            } else {
                placementElement = placement;
            }

            var player = thisComponent.props.players.find(function(p) {
                return p.id === playerScore.id;
            });

            return (
                <tr key={player.id}>
                    <td style={{textAlign: "center"}}>{placementElement}</td>
                    <td style={{color: player.color.hexCode}}>{player.name}</td>
                    <td>{playerScore.score}</td>
                </tr>
            )
        });

        var roundElements = this.props.matchState.roundsData.map(function (roundData, index) {
            var width = 208;
            var mapBorderWidth = 10;
            var gameState = roundData.gameState;
            var scale = width / (gameState.map.width + mapBorderWidth * 2);
            var winningPlayerId = scoreUtil.createSortedList(roundData.roundScore)[0].id;
            var winningPlayer = thisComponent.props.players.find(function(p) {
                return p.id === winningPlayerId;
            });

            return (
                <div key={index} className="m-x-2 m-b-3 round-replay" style={{width: width}}>
                    <div style={{textAlign: "center"}}><span style={{color: winningPlayer.color.hexCode}}>{winningPlayer.name}</span></div>
                    <div onClick={thisComponent.props.onRoundClick.bind(null, index)}>
                        <div className="round-watch-replay">Watch replay</div>
                        <GameCanvas gameState={gameState} playerConfigs={thisComponent.props.players} mapBorderWidth={mapBorderWidth} scale={scale} renderTime={gameState.gameTime}/>
                    </div>
                </div>
            );
        });

        return (
            <div className="m-x-2">
                <div className="flex flex-no-wrap">
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
                        <ScoreGraph roundsData={this.props.matchState.roundsData} players={this.props.players}/>
                    </div>
                </div>
                <div className="flex">
                    {roundElements}
                </div>
            </div>
        );
    }
});
