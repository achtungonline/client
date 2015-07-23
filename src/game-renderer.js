module.exports = function GameRenderer(mapRenderer, wormsRenderer) {
    function render() {
        mapRenderer.render();
        wormsRenderer.render();
    }

    return {
        render: render
    };
};