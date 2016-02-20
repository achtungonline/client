var PlayerSteeringListener = require("./player-steering-listener.js");
var KeyListenerFactory = require("./../../game-module/key-listener-factory.js");

module.exports = function PlayerSteeringListenerFactory(game) {

    function create() {
        return PlayerSteeringListener(KeyListenerFactory().create(), game);
    }

    return {
        create: create
    };
};
