module.exports = function CanvasRenderer(mapRenderer, wormsRenderer, playAreaRenderer, renderProperties) {

    function render() {
        mapRenderer.render();
        wormsRenderer.render();
        playAreaRenderer.render();
    }

    function setRenderProperty(property, value) {
        renderProperties[property] = value;
    }

    return {
        render: render,
        setRenderProperty: setRenderProperty
    };
};