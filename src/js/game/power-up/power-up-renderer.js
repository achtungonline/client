module.exports = function PowerUpRenderer(gameState, powerUpContext, shapeRenderer, renderProperties) {

    var render = function () {
        // TODO Remove if statement when things are tested
        if (gameState.powerUps) {
            powerUpContext.clearRect(0, 0, powerUpContext.canvas.width, powerUpContext.canvas.height);
            gameState.powerUps.forEach(function renderPowerUp(powerUp) {
                shapeRenderer.render(powerUpContext, powerUp.shape, "pink");
            });
        }
    };

    return {
        render: render
    };
};