var KeyListener = require("./key-listener.js");

module.exports = function KeyListenerFactory() {

    function create() {
        return KeyListener(document.onkeydown, document.onkeyup);
    }

    return {
        create: create
    }
};