module.exports = function GameView(gameView, gameInfoView) {
    var gameContainer = document.createElement("div");
    gameContainer.className = "game-container";

    function render() {
        gameContainer.innerHTML = "";
        gameContainer.appendChild(gameView.content);
        gameContainer.appendChild(gameInfoView.content);
    }

    return {
        render: render,
        content: gameContainer
    };
};