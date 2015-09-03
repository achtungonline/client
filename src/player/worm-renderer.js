var COLOR_STRINGS = require("./../default-values.js").player.COLOR_STRINGS;

module.exports = function WormRenderer(worm, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties) {

    function render() {
        var largerHead = shapeModifierImmutable.changeSize(worm.head, 2);
        shapeRenderer.render(wormHeadsContext, largerHead, "yellow");
        if (renderProperties.drawArrows) {
            drawArrow(worm);
        }
    }

    function drawArrow(worm) {
        wormHeadsContext.fillStyle = COLOR_STRINGS[worm.id];
        wormHeadsContext.strokeStyle = COLOR_STRINGS[worm.id];
        wormHeadsContext.lineWidth = 5;
        wormHeadsContext.save();
        wormHeadsContext.beginPath();
        wormHeadsContext.translate(worm.head.centerX, worm.head.centerY);
        wormHeadsContext.rotate(worm.direction - Math.PI/2);
        wormHeadsContext.moveTo(0,2);
        wormHeadsContext.lineTo(0,15);
        wormHeadsContext.stroke();
        wormHeadsContext.lineTo(-5,15);
        wormHeadsContext.lineTo(0,25);
        wormHeadsContext.lineTo(5,15);
        wormHeadsContext.lineTo(0,15);
        wormHeadsContext.closePath();
        wormHeadsContext.restore();
        wormHeadsContext.fill();
    }

    return {
        render: render
    };
};