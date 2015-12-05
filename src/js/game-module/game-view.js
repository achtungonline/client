module.exports = function GameView(gameAreaView, fpsView, pauseView, stopView, scoreView) {
    function render() {
        var gameContainer = document.createElement("div");
        gameContainer.className = "ao-game";
        gameContainer.appendChild(gameAreaView.render());
        gameContainer.appendChild(scoreView.render());
        gameContainer.appendChild(fpsView.render());
        gameContainer.appendChild(pauseView.render());
        gameContainer.appendChild(stopView.render());
        return gameContainer;
    }

    return {
        render: render
    };
};