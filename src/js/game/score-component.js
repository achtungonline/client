var React = require("react");

var scoreUtil = require("core/src/core/score/score-util.js");

module.exports = function Score({ match, startScore, roundScore }) {

    var combinedScore = scoreUtil.combineScores(startScore, roundScore);
    var highestRoundScore = scoreUtil.getHighestScore(roundScore);


    var scoreTableRows = scoreUtil.createSortedList(combinedScore).map(function (playerScore) {
        var opacity = roundScore[playerScore.id] === highestRoundScore ? 1 : 0.25;
        var player = match.matchConfig.players.find(function(p) {
            return p.id === playerScore.id;
        });

        return (
            <tr key={player.id} style={{opacity: opacity}}>
                <td style={{color: player.color.hexCode}}>{player.name}</td>
                <td>{playerScore.score}</td>
                <td style={{minWidth: "34px"}}>{roundScore[playerScore.id] ? " +" + roundScore[playerScore.id] : ""}</td>
            </tr>
        )
    });

    return (
        <div>
            <div className="flex flex-center max-score m-b-2">
                <img src="src/css/svg/trophy.svg" alt="Max score: "/>
                <div className="flex-self-center">{match.matchConfig.maxScore}</div>
            </div>
            <table style={{width: "100%"}}>
                <tbody>
                {scoreTableRows}
                </tbody>
            </table>
        </div>
    );
};