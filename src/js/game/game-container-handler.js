var PlayAreaContainerHandler = require("./play-area/play-area-container-handler.js");
var GameInfoContainerHandler = require("./game-info/game-info-container-handler.js");
/**
 * The gameContainer is the top of the tree. Responsible of all element content regarding a game instance.
 * @param gameContainer
 * @param gameHandler
 * @param fpsHandler
 * @returns {{start: Function}}
 * @constructor
 */
module.exports = function GameContainerHandler(gameContainer, gameHandler, fpsHandler) {
    var playAreaContainer = document.createElement('div');
    playAreaContainer.className = 'play-area-container';
    var gameInfoContainer = document.createElement('div');
    gameInfoContainer.className = 'game-info-container';

    gameContainer.appendChild(playAreaContainer);
    gameContainer.appendChild(gameInfoContainer);


    var playAreaContainerHandler = PlayAreaContainerHandler(playAreaContainer, gameHandler);
    var gameInfoContainerHandler = GameInfoContainerHandler(gameInfoContainer, fpsHandler);
};