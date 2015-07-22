module.exports = function KeyListener(addKeyPressedEventFunction, addKeyReleasedEventFunction) {

    function onKeyPressed(keyCode, callback) {
        addKeyPressedEventFunction(function (event) {
            if (keyCode === event.keyCode) {
                callback();
            }
        });
    }

    function onKeyReleased(keyCode, callback) {
        addKeyReleasedEventFunction(function (event) {
            if (keyCode === event.keyCode) {
                callback();
            }
        });
    }

    return {
        onKeyPressed: onKeyPressed,
        onKeyReleased: onKeyReleased
    }
};