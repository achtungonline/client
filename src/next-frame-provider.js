var nextFrameProvider = window.requestAnimationFrame;

if (!nextFrameProvider) {
    nextFrameProvider = function (callback) {
        setTimeout(callback, 0);
    }
}

module.exports = nextFrameProvider;