var COLOR_STRINGS = require("./../default-values.js").player.COLOR_STRINGS;

module.exports = function WormRenderer(worm, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties) {

    var lastRenderedHead;

    function render() {
        var largerHead = shapeModifierImmutable.changeSize(worm.head, 2);
        shapeRenderer.render(wormHeadsContext, largerHead, "yellow");
        lastRenderedHead = largerHead;
        if (renderProperties.drawArrows) {
            drawArrow(worm);
        }
        if (renderProperties.showTrajectories && worm.alive && worm.trajectory) {
            drawTrajectory(worm, worm.trajectory);
        }
    }

    function clearHead() {
        if (lastRenderedHead) {
            wormHeadsContext.clearRect(lastRenderedHead.x - 5, lastRenderedHead.y - 5, lastRenderedHead.boundingBox.width + 10, lastRenderedHead.boundingBox.height + 10);
        }
    }

    function drawTrajectory(worm, trajectory) {
        wormHeadsContext.save();
        wormHeadsContext.strokeStyle = COLOR_STRINGS[worm.id];
        wormHeadsContext.setLineDash([2,5]);
        wormHeadsContext.lineWidth = 2;
        wormHeadsContext.beginPath();
        wormHeadsContext.translate(worm.head.centerX, worm.head.centerY);
        wormHeadsContext.rotate(worm.direction - Math.PI/2);
        trajectory.forEach(function (move) {
            var turnRadius;
            if (move.turningSpeed !== 0) {
                turnRadius = Math.abs(move.speed / move.turningSpeed);
            }
            wormHeadsContext.moveTo(0, 0);
            var distanceTravelled = move.speed * move.duration;
            var angleTurned = move.turningSpeed * move.duration;
            if (move.turningSpeed < 0) {
                wormHeadsContext.arc(turnRadius, 0, turnRadius, Math.PI, Math.PI + angleTurned, true);
                wormHeadsContext.translate(-turnRadius*(Math.cos(angleTurned) -  1), -turnRadius*Math.sin(angleTurned));
                wormHeadsContext.rotate(angleTurned);
            } else if (move.turningSpeed > 0) {
                wormHeadsContext.arc(-turnRadius, 0, turnRadius, 0, angleTurned);
                wormHeadsContext.translate(turnRadius*(Math.cos(angleTurned) - 1), turnRadius*Math.sin(angleTurned));
                wormHeadsContext.rotate(angleTurned);
            } else {
                wormHeadsContext.lineTo(0, distanceTravelled);
                wormHeadsContext.translate(0, distanceTravelled);
            }
        });
        wormHeadsContext.stroke();
        wormHeadsContext.restore();
    }

    function drawArrow(worm) {
        wormHeadsContext.save();
        wormHeadsContext.fillStyle = COLOR_STRINGS[worm.id];
        wormHeadsContext.strokeStyle = COLOR_STRINGS[worm.id];
        wormHeadsContext.lineWidth = 5;
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
        wormHeadsContext.fill();
        wormHeadsContext.restore();
    }

    return {
        render: render,
        clearHead: clearHead
    };
};