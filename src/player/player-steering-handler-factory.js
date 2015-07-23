var PlayerSteeringHandler = require("./player-steering-handler.js");
var KeyListenerFactory = require("./../key-listener-factory.js");

module.exports = function PlayerSteeringHandlerFactory(game) {

    function create() {

        return PlayerSteeringHandler(KeyListenerFactory().create(), game);
    }

    return {
        create: create
    }
}
