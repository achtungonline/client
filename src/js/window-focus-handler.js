function WindowFocusHandler() {
    var focusListeners = [];
    var blurListeners = [];

    function init() {
        function onWindowFocus() {
            focusListeners.forEach(function (listener) {
                listener();
            });
        }

        function onWindowBlur() {
            blurListeners.forEach(function (listener) {
                listener();
            });
        }

        // Set the name of the hidden property and the change event for visibility
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        function handleVisibilityChange() {
            if (document[hidden]) {
                onWindowBlur();
            } else {
                onWindowFocus();
            }
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
            console.error("This game requires a modern browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
        } else {
            // Handle page visibility change
            document.addEventListener(visibilityChange, handleVisibilityChange);
        }
    }

    function removeListener(listeners, callback) {
        var index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index);
        }
    }

    function on(event, callback) {
        if (event === "focus") {
            focusListeners.push(callback);
        } else if (event === "blur") {
            blurListeners.push(callback);
        } else {
            throw new Error("Invalid event: " + event);
        }
    }

    function off(event, callback) {
        if (event === "focus") {
            removeListener(focusListeners, callback);
        } else if (event === "blur") {
            removeListener(blurListeners, callback);
        } else {
            throw new Error("Invalid event: " + event);
        }
    }

    init();

    return {
        on: on,
        off: off
    };
};

module.exports = WindowFocusHandler();
