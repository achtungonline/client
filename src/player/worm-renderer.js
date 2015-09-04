var COLOR_STRINGS = require("./../default-values.js").player.COLOR_STRINGS;
var STEERING = require("core/src/player/player.js").steering;

module.exports = function WormRenderer(worm, shapeRenderer, wormHeadsContext, shapeModifierImmutable, renderProperties) {

    function render() {
        var largerHead = shapeModifierImmutable.changeSize(worm.head, 2);
        shapeRenderer.render(wormHeadsContext, largerHead, "yellow");
        if (renderProperties.drawArrows) {
            drawArrow(worm);
        }
        if (renderProperties.showTrajectories && worm.alive && worm.trajectory) {
            drawTrajectory(worm, worm.trajectory);
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

        var turnRadius = worm.speed / worm.turningSpeed;
        trajectory.forEach(function (move) {
            wormHeadsContext.moveTo(0, 0);
            var distanceTravelled = worm.speed * move.time;
            var angleTurned = worm.turningSpeed * move.time;
            if (move.steering === STEERING.LEFT) {
                wormHeadsContext.arc(turnRadius, 0, turnRadius, Math.PI, Math.PI - angleTurned, true);
                wormHeadsContext.translate(-turnRadius*(Math.cos(angleTurned) -  1), turnRadius*Math.sin(angleTurned));
                wormHeadsContext.rotate(-angleTurned);
            } else if (move.steering == STEERING.RIGHT) {
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
        render: render
    };
};