module.exports = function FpsView(fpsHandler) {

    fpsHandler.on(fpsHandler.events.FPS_CHANGED, function (fps) {
        setFpsValue(fps);
    });

    var fpsContainer = document.createElement("div");
    var fpsHeader = document.createElement('h4');
    fpsContainer.appendChild(fpsHeader);
    fpsContainer.className = "ao-fps";
    fpsHeader.innerHTML = "FPS: ";

    fpsHandler.start();

    function setFpsValue(fps) {
        fpsContainer.innerHTML = "";
        fpsContainer.appendChild(fpsHeader);
        fpsContainer.appendChild(document.createTextNode(fps));
    }

    function render() {
        return fpsContainer;
    }

    return {
        render: render
    };
};