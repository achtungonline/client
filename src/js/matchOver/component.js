var React = require("react");
var scoreUtils = require("./../score-utils.js");
var Header = require("../header/header.js");
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

var RoundsStatistics = React.createClass({
    render: function () {
        var thisComponent = this;
        var roundElements = this.props.roundsData.map(function (roundData, index) {
            var width = 250;
            var winningPlayer = thisComponent.props.players.find(function (player) {
                return player.id === roundData.roundWinners[0];
            });
            return (
                <div key={index} className="m-x-2" style={{width: width}}>
                    <div style={{textAlign: "center"}}><span style={{color: winningPlayer.color.hexCode}}>{winningPlayer.name}</span></div>
                    <RoundCanvas width={width} gameState={roundData.gameState} playerConfigs={thisComponent.props.players}/>
                    <button className="btn btn-secondary" style={{marginTop: 0}} onClick={thisComponent.props.onRoundClick.bind(null, index)}>Replay</button>
                </div>);
        });
        return (
            <div className="flex">
                {roundElements}
            </div>
        )
    }
});

module.exports = React.createClass({
    displayName: "MatchOver",
    render: function () {
        var thisComponent = this;

        var equalScoreCounter = 0;
        var prevScore = -1;
        var scoreTableRows = scoreUtils.sort(this.props.players, this.props.matchState).map(function (player, index) {
            var score = thisComponent.props.matchState.score[player.id];
            if (prevScore === score) {
                equalScoreCounter++;
            } else {
                equalScoreCounter = 0;
            }
            prevScore = score;

            var placement = index + 1 - equalScoreCounter;
            var placementElement;

            if (placement === 1) {
                placementElement = <img src="src/css/svg/gold-trophy.svg" alt="Max score: "/>
            } else if (placement === 2) {
                placementElement = <img src="src/css/svg/silver-trophy.svg" alt="Max score: "/>
            } else if (placement === 3) {
                placementElement = <img src="src/css/svg/bronze-trophy.svg" alt="Max score: "/>
            } else {
                placementElement = placement;
            }

            return (
                <tr key={player.id}>
                    <td style={{textAlign: "center"}}>{placementElement}</td>
                    <td style={{color: player.color.hexCode}}>{player.name}</td>
                    <td>{score}</td>
                </tr>
            )
        });

        return (
            <div className="page-center">
                <Header/>
                <div className="m-x-2">
                    <div className="m-b-3" style={{width: "300px"}}>
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
                    <RoundsStatistics matchState={this.props.matchState}
                                      players={this.props.players}
                                      roundsData={this.props.roundsData}
                                      onRoundClick={this.props.onRoundClick}/>
                </div>
            </div>
        );
    }
});
