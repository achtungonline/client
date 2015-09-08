module.exports = function GameInfoView(fpsView) {
    var gameInfoContainer = document.createElement("div");
    gameInfoContainer.className = "game-info-container";

    function render() {
        gameInfoContainer.innerHTML = "";
        gameInfoContainer.appendChild(fpsView.content);
    }

    return {
        render: render,
        content: gameInfoContainer
    };
};