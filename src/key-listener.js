var keyEventFunction = function (keyListeners, e) {
    if (e !== undefined && e !== null) {
        keyListeners.forEach(function (keyListener) {
            keyListener(e.keyCode);
        });
    }

    return {
        keyListeners: keyListeners
    }
};

module.exports = function KeyListener() {

    if (document.onkeydown !== undefined && document.onkeydown !== null) {
        throw new Error("Trying to override documeny.onkeydown with new keylistener. Check code");
    } else {
        var keyPressedListeners = [];
        document.onkeydown = keyEventFunction.bind(null, keyPressedListeners);
    }
    if (document.onkeyup !== undefined && document.onkeyup !== null) {
        throw new Error("Trying to override documeny.onkeyup with new keylistener. Check code");
    } else {
        var keyReleasedListeners = [];
        document.onkeyup = keyEventFunction.bind(null, keyReleasedListeners);
    }

    function onKeyPressed(keyCode, callback) {
        document.onkeydown(null).keyListeners.push(function (keyCodePressed) {
            if (keyCode === keyCodePressed) {
                callback();
            }
        });
    }

    function onKeyReleased(keyCode, callback) {
        document.onkeyup(null).keyListeners.push(function (keyCodePressed) {
            if (keyCode === keyCodePressed) {
                callback();
            }
        });
    }

    return {
        onKeyPressed: onKeyPressed,
        onKeyReleased: onKeyReleased
    }
};