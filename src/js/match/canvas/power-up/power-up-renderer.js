var ShapeRendererFactory = require("./../shape/shape-renderer-factory.js");

var shapeRenderer = ShapeRendererFactory().create();

module.exports = function PowerUpRenderer(powerUpContext) {

    var powerUpImageRenderers = {};

    var render = function (gameState) {
        powerUpContext.clearRect(0, 0, powerUpContext.canvas.width, powerUpContext.canvas.height);
        gameState.powerUps.forEach(function renderPowerUp(powerUp) {

            if(powerUpImageRenderers[powerUp.name]) {
                powerUpImageRenderers[powerUp.name](powerUp);
                //powerUpContext.drawImage(powerUpImages[powerUp.name], powerUp.shape.x, powerUp.shape.y, powerUp.shape.boundingBox.width, powerUp.shape.boundingBox.height);
            } else {
                var image = new Image();
                image.src = "src/css/svg/powerup/" + powerUp.name + ".svg";
                image.onload = function () {
                    var imageElement = document.createElement('img');
                    imageElement.src = "src/css/svg/powerup/" + powerUp.name + ".svg";

                    powerUpImageRenderers[powerUp.name] = function(powerUp) {
                        powerUpContext.drawImage(imageElement, powerUp.shape.x, powerUp.shape.y, powerUp.shape.boundingBox.width, powerUp.shape.boundingBox.height);
                    };

                    // image exists and is loaded
                    //powerUpContext.drawImage(image, powerUp.shape.x, powerUp.shape.y, powerUp.shape.boundingBox.width, powerUp.shape.boundingBox.height);
                    //var imageElement = document.createElement('img');
                    //imageElement.src = "src/css/svg/powerup/" + powerUp.name + ".svg";
                    //powerUpContext.drawImage(imageElement, powerUp.shape.x, powerUp.shape.y, powerUp.shape.boundingBox.width, powerUp.shape.boundingBox.height);
                };
                image.onerror = function () {
                    powerUpImageRenderers[powerUp.name] = function(powerUp) {
                        var color = "black";
                        if (powerUp.affects === "self") {
                            color = "green";
                        } else if (powerUp.affects === "others") {
                            color = "red";
                        } else if (powerUp.affects === "all") {
                            color = "blue";
                        }
                        shapeRenderer.render({
                            canvasContext: powerUpContext,
                            shape: powerUp.shape,
                            fillColor: color
                        });
                        powerUpContext.font = "14px Arial";
                        powerUpContext.textAlign = "center";
                        powerUpContext.textBaseline = "middle";
                        powerUpContext.fillStyle = "white";
                        powerUpContext.fillText(powerUp.name, powerUp.shape.centerX, powerUp.shape.centerY);
                    }
                };

            }


            //var imageElement = document.createElement('img');
            //imageElement.src = "src/css/svg/powerup/" + powerUp.name + ".svg";
            //powerUpContext.drawImage(powerUpImages[powerUp.name], powerUp.shape.x, powerUp.shape.y, powerUp.shape.boundingBox.width, powerUp.shape.boundingBox.height);

        });
    };

    return {
        render: render
    };
};