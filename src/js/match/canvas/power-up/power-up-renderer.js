module.exports = function PowerUpRenderer(gameState, powerUpContext, shapeRenderer) {

    var render = function () {
        powerUpContext.clearRect(0, 0, powerUpContext.canvas.width, powerUpContext.canvas.height);
        gameState.powerUps.forEach(function renderPowerUp(powerUp) {
            var color = "black";
            if (powerUp.affects === "self") {
                color = "green";
            } else if (powerUp.affects === "others") {
                color = "red";
            } else if (powerUp.affects === "all") {
                color = "blue";
            }
            shapeRenderer.render(powerUpContext, powerUp.shape, color);
            powerUpContext.font = "14px Arial";
            powerUpContext.textAlign = "center";
            powerUpContext.textBaseline = "middle";
            powerUpContext.fillStyle = "white";
            powerUpContext.fillText(powerUp.name, powerUp.shape.centerX, powerUp.shape.centerY);
        });
    };

    return {
        render: render
    };
};