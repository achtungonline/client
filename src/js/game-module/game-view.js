module.exports = function GameView(gameAreaView, fpsView) {
    function render() {
        var gameContainer = document.createElement("div");
        gameContainer.className = "ao-game";
        gameContainer.appendChild(gameAreaView.render());
        gameContainer.appendChild(fpsView.render());
        return gameContainer;
    }

    return {
        render: render
    };
};