var BLINK_DURATION = 2;
var FADE_LOW_POINT = 0.2;

var startTime = Date.now() / 1000;

module.exports = function GamePreviewOverlay({ canvas, gameState }) {
    var context = canvas.getContext("2d");

    var render = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var timeDiff = (Date.now()/1000 - startTime) % BLINK_DURATION;
        var a = timeDiff / BLINK_DURATION * Math.PI;
        var fontSize = Math.max(canvas.width, canvas.height) / 25;
        var offsetX = 19/20*canvas.width, offsetY = 1/20*canvas.height;
        if (gameState.map.shape.type === "circle") {
            offsetX = 99/100*canvas.width;
            offsetY = 1/50*canvas.height;
        }
        offsetY += fontSize;

        context.globalAlpha = FADE_LOW_POINT + Math.sin(a) * (1 - FADE_LOW_POINT);
        context.font = fontSize + "px bungee";
        context.fillStyle = "black";
        context.textAlign = "right";
        context.fillText("Preview", offsetX, offsetY);
    };

    return {
        render: render
    };
};
