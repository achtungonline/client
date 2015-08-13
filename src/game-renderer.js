module.exports = function GameRenderer(mapRenderer, wormsRenderer, playAreaRenderer) {
    function render() {
        mapRenderer.render();
        wormsRenderer.render();
        playAreaRenderer.render();
    }

    return {
        render: render
    };
};