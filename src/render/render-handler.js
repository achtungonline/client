module.exports = function RenderHandler(canvasContext, shapeRenderer, mapRenderer) {
    return {
        renderShape: shapeRenderer.render.bind(null, canvasContext),
        renderMap: mapRenderer.render.bind(null, canvasContext)
    }
};
