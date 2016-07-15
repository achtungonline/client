var React = require("react");
var scoreUtils = require("./../score-utils.js");
var gameStateFunctions = require("core/src/core/game-state-functions.js");

module.exports = function Score({ startScoreState, scoreState, players, gameState, maxScore }) {
    var scoreTableRows = scoreUtils.sort(players.slice(0), scoreState).map(function (player) {
        var roundStartScore = startScoreState.score[player.id] || 0;
        var score = scoreState.score[player.id] || 0;
        var thisRoundScore = score - roundStartScore;
        var roundScore = (thisRoundScore ? " +" + thisRoundScore : "");
        var opacity = gameStateFunctions.isPlayerAlive(gameState, player.id) ? 1 : 0.25;

        return (
            <tr key={player.id} style={{opacity: opacity}}>
                <td style={{color: player.color.hexCode}}>{player.name}</td>
                <td>{score}</td>
                <td style={{minWidth: "34px"}}>{roundScore}</td>
            </tr>
        )
    });

    return (
        <div>
            <div className="flex flex-center max-score m-b-2">
                <img src="src/css/svg/trophy.svg" alt="Max score: "/>
                <div className="flex-self-center">{maxScore}</div>
            </div>
            <table style={{width: "100%"}}>
                <tbody>
                {scoreTableRows}
                </tbody>
            </table>
        </div>
    );
}