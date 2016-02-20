module.exports = function KeyListener() {
    var addKeyPressedEventFunction = document.addEventListener.bind(null, "keydown");
    var addKeyReleasedEventFunction = document.addEventListener.bind(null, "keyup");

    function onKeyPressed(keyCode, callback) {
        addKeyPressedEventFunction(function (event) {
            console.log(event.keyCode);
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
    };
};