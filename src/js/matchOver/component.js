var React = require("react");
var scoreUtil = require("core/src/core/score/score-util.js");
var GameCanvasRenderer = require("./../match/canvas/game-canvas-renderer.js");

var RoundCanvas = React.createClass({
    render: function () {
        return <div ref="gameCanvas"></div>;
    },
    componentDidMount: function () {
        var mapBorderWidth = 10;
        var scale = this.props.width / (this.props.gameState.map.width + mapBorderWidth * 2);

        var gameCanvasRenderer = GameCanvasRenderer({gameState: this.props.gameState, playerConfigs: this.props.playerConfigs, scale: scale, mapBorderWidth: mapBorderWidth});
        gameCanvasRenderer.render();
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasRenderer.container);
    }
});

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
            var winningPlayerId = scoreUtil.createSortedList(roundData.roundScore)[0].id;
            var winningPlayer = thisComponent.props.players.find(function(p) {
                return p.id === winningPlayerId;
            });

            return (
                <div key={index} className="m-x-2 m-b-3 round-replay" style={{width: width}}>
                    <div style={{textAlign: "center"}}><span style={{color: winningPlayer.color.hexCode}}>{winningPlayer.name}</span></div>
                    <div onClick={thisComponent.props.onRoundClick.bind(null, index)}>
                        <div className="round-watch-replay">Watch replay</div>
                        <RoundCanvas width={width} gameState={roundData.gameState} playerConfigs={thisComponent.props.players}/>
                    </div>
                </div>);
        });

        return (
            <div className="m-x-2">
                <div className="m-b-3 m-r-3" style={{width: "455px"}}>
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
                <div className="flex">
                    {roundElements}
                </div>
            </div>
        );
    }
});
