module.exports = function GameRenderer(mapRenderer, wormRenderer) {
    function render(game) {
        mapRenderer.render(game.map);

        game.players.forEach(function (player) {
            player.worms.forEach(function (worm) {
                wormRenderer.render(worm);
            });
        });
    }

    return {
        render: render
    };
};