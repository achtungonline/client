module.exports = function PauseView(gameHandler){

    function render() {
        var button = document.createElement("button");
        pauseButton();

        function pauseButton() {
            button.innerHTML = "Pause Game";
            button.onclick = function () {
                gameHandler.pause();
                resumeButton();
            };
        }

        function resumeButton() {
            button.innerHTML = "Resume Game";
            button.onclick = function () {
                gameHandler.resume();
                pauseButton();
            };
        }
        return button;
    }

    return {
        render: render
    };
};