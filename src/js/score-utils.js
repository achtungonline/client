var utils = {};

utils.sort = function (players, matchState) {
    return players.sort(function (p1, p2) {
        function getRoundsWon(playerId) {
            return matchState.roundWinners.filter(function (roundWinner) {
                return roundWinner.indexOf(playerId) !== -1;
            }).length;
        }

        if (matchState.score[p1.id] === matchState.score[p2.id]) {
            return getRoundsWon(p1.id) < getRoundsWon(p2.id);
        } else {
            return matchState.score[p1.id] < matchState.score[p2.id];
        }
    });
};

module.exports = utils;

