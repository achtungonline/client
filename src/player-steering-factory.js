var PlayerSteeringHandler = require("./player-steering.js");
var KeyListenerFactory = require("./key-listener-factory.js");

module.exports = function PlayerSteeringFactory(game) {

    function createHandler() {

        return PlayerSteeringHandler(KeyListenerFactory().create(), game);
    }

    return {
        createHandler: createHandler
    }
}
