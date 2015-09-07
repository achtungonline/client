/**
 * Responsible of the game data outside the play area. Such as the leaderboard and fbs.
 * @param gameInfoContainer
 * @constructor
 */
module.exports = function GameInfoContainerHandler(gameInfoContainer, fpsHandler) {
    var fpsContainer = document.createElement('div');
    var fpsHeader = document.createElement('h4');
    var p = document.createElement('p');

    gameInfoContainer.appendChild(fpsContainer);
    fpsContainer.appendChild(fpsHeader);
    fpsContainer.appendChild(p);

    fpsContainer.className = 'fps-container';
    fpsHeader.setAttribute('id', 'fps');
    fpsHeader.innerHTML = "FPS: ";
    
    fpsHandler.on("fpsChanged", function (fps) {
        p.innerHTML = fps;
    });
};