/**
 * Responsible of the game data outside the play area. Such as the leaderboard and fbs.
 * @param gameInfoContainer
 * @constructor
 */
module.exports = function GameInfoContainerHandler(gameInfoContainer, fpsHandler) {
    var fpsContainer = document.createElement('div');
    fpsContainer.className = 'fps-container';

    gameInfoContainer.appendChild(fpsContainer);

    fpsHandler.on("fpsChanged", function (fps) {
        fpsContainer.innerHTML = fps;
    });
};