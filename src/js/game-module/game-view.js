module.exports = function GameView(gameAreaView, fpsView, pauseView) {
    function render() {
        var gameContainer = document.createElement("div");
        gameContainer.className = "ao-game";
        gameContainer.appendChild(gameAreaView.render());
        gameContainer.appendChild(fpsView.render());
        gameContainer.appendChild(pauseView.render());
        return gameContainer;
    }

    return {
        render: render
    };
};