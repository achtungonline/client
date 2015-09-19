module.exports = function CanvasRenderer(mapRenderer, wormHeadsRenderer, powerUpRenderer, playAreaRenderer, renderProperties) {

    function render() {
        mapRenderer.render();
        wormHeadsRenderer.render();
        powerUpRenderer.render();
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