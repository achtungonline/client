module.exports = function FpsController(fpsView, fpsHandler) {

    fpsHandler.on("fpsChanged", function (fps) {
        fpsView.render(fps);
    });

    return {
        activate: function() {
            fpsHandler.start();
        },
        view: fpsView
    }
};