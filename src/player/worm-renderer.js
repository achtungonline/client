module.exports = function WormRenderer(worm, shapeRenderer, wormBodiesContext, wormHeadsContext) {
    var lastBodyIndexRendered = -1;

    function render() {
        while(lastBodyIndexRendered < worm.body.length - 1) {
            lastBodyIndexRendered++;
            shapeRenderer.render(wormBodiesContext, worm.body[lastBodyIndexRendered], "red");
        }

        shapeRenderer.render(wormHeadsContext, worm.head, "yellow");
    }

    return {
        render: render
    };
};