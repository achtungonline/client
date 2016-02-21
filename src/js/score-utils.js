var utils = {};

utils.sort = function (players, matchState) {
    return players.sort(function (p1, p2) {
        if (matchState.score[p1.id] === matchState.score[p2.id]) {
            return matchState.roundsWon[p1.id] < matchState.roundsWon[p2.id];
        } else {
            return matchState.score[p1.id] < matchState.score[p2.id];
        }
    });
};

module.exports = utils;

