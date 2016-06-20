var React = require("react");
var scoreUtils = require("./../score-utils.js");
var Header = require("../header/header.js");

module.exports = React.createClass({
    displayName: "MatchOver",
    render: function () {
        var thisComponent = this;

        var equalScoreCounter = 0;
        var prevScore = -1;
        var prevRoundsWon = -1;
        var scoreTableRows = scoreUtils.sort(this.props.players, this.props.matchState).map(function (player, index) {
            var score = thisComponent.props.matchState.score[player.id];
            var roundsWon = thisComponent.props.matchState.roundsWon[player.id];
            if (prevScore === score && roundsWon === prevRoundsWon) {
                equalScoreCounter++;
            } else {
                equalScoreCounter = 0;
            }
            prevScore = score;
            prevRoundsWon = roundsWon;

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
                <div className="m-x-2" style={{width: "300px"}}>
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
            </div>
        );
    }
});
