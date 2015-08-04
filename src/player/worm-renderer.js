module.exports = function WormRenderer(worm, shapeRenderer, wormBodiesContext, wormHeadsContext, shapeModifierImmutable) {
    var lastBodyIndexRendered = -1;

    function render() {
        while(lastBodyIndexRendered < worm.body.length - 1) {
            lastBodyIndexRendered++;
            shapeRenderer.render(wormBodiesContext, worm.body[lastBodyIndexRendered], "red");
        }

        var largerHead = shapeModifierImmutable.changeSize(worm.head, 2);
        shapeRenderer.render(wormHeadsContext, largerHead, "yellow");
    }

    return {
        render: render
    };
};