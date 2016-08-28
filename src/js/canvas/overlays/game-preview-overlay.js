var BLINK_DURATION = 2;
var FADE_LOW_POINT = 0.2;

var startTime = Date.now() / 1000;

module.exports = function GamePreviewOverlay({ canvas }) {
    var context = canvas.getContext("2d");

    var render = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var timeDiff = (Date.now()/1000 - startTime) % BLINK_DURATION;
        var a = timeDiff / BLINK_DURATION * Math.PI;
        context.globalAlpha = FADE_LOW_POINT + Math.sin(a) * (1 - FADE_LOW_POINT);
        context.font = "20px bungee";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("Preview", 7/8*canvas.width, 1/15*canvas.height);
    };

    return {
        render: render
    };
};
