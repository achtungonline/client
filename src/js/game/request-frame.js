var requestFrame = window.requestAnimationFrame;

if (!requestFrame) {
    requestFrame = function (callback) {
        setTimeout(callback, 0);
    };
}

export default requestFrame;