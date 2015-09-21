module.exports = function StopView(gameHandler) {

    function render() {
        var button = document.createElement("button");
        button.innerHTML = "Stop Game";
        button.onclick = function () {
            gameHandler.stop();
        };
        return button;
    }

    return {
        render: render
    };
};