module.exports = function ScoreView(scoreHandler) {

    scoreHandler.on(scoreHandler.events.SCORE_CHANGED, function (score) {
        setScore(score);
    });

    var scoreContainer = document.createElement("div");
    var scoreList = document.createElement('ul');
    scoreContainer.appendChild(scoreList);

    function setScore(score) {
        scoreList.innerHTML = "";
        score.forEach(function (scoreItem) {
            var listItem = document.createElement("li");
            listItem.innerHTML = scoreItem.name + "\t" +scoreItem.score;
            scoreList.appendChild(listItem);
        });
    }

    function render() {
        return scoreContainer;
    }

    return {
        render: render
    };
};