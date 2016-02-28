var React = require("react");

var scoreUtils = require("./../score-utils.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");


module.exports = function Score({ startScoreState, scoreState, players, gameState, maxScore }) {
    var scoreTableRows = scoreUtils.sort(players, scoreState).map(function (player) {
        var roundStartScore = startScoreState.score[player.id] || 0;
        var score = scoreState.score[player.id] || 0;
        var thisRoundScore = score - roundStartScore;
        var scoreColumn = score + (thisRoundScore ? " +" + thisRoundScore : "");
        var opacity = gameStateFunctions.isPlayerAlive(gameState, player.id) ? 1 : 0.25;

        return (
            <tr key={player.id} style={{color: player.color.hexCode, opacity: opacity}}>
                <td>{player.name}</td>
                <td>{scoreColumn}</td>
            </tr>
        )
    });

    return (
        <div>
            <table>
                <tbody>
                {scoreTableRows}
                </tbody>
            </table>
            <div>Max score: {maxScore}, you have to win by 2 points</div>
        </div>
    );
};
