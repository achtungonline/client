module.exports = function FpsView() {
    var fpsContainer = document.createElement("div");
    var fpsHeader = document.createElement('h4');

    fpsContainer.appendChild(fpsHeader);

    fpsContainer.className = "fps-container";
    fpsHeader.innerHTML = "FPS: ";

    function render(fps) {
        fpsContainer.innerHTML = "";
        fpsContainer.appendChild(fpsHeader);
        fpsContainer.appendChild(document.createTextNode(fps));
    }

    return {
        render: render,
        content: fpsContainer
    };
};