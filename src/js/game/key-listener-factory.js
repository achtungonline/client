var KeyListener = require("./key-listener.js");

module.exports = function KeyListenerFactory() {

    function create() {
        return KeyListener(document.addEventListener.bind(null, "keydown"), document.addEventListener.bind(null, "keyup"));
    }

    return {
        create: create
    };
};