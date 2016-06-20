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
            return (
                <tr key={player.id} style={{color: player.color.hexCode}}>
                    <td>{index + 1 - equalScoreCounter}.</td>
                    <td>{player.name}</td>
                    <td>{score}</td>
                    <td>{roundsWon}</td>
                </tr>
            )
        });

        return (
            <div className="page-center">
                <Header/>
                Final score standings

                <table>
                    <thead>
                    <tr>
                        <td>Placement</td>
                        <td>Name</td>
                        <td>Score</td>
                        <td>Rounds Won</td>
                    </tr>
                    </thead>
                    <tbody>
                    {scoreTableRows}
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={this.props.onRestartAction}>Restart</button>
                <button className="btn btn-secondary" onClick={this.props.onExitAction}>Exit</button>
            </div>
        );
    }
});
