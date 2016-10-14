import {STEERING_LEFT, STEERING_RIGHT} from "core/src/core/constants.js";

import {parseEvent} from "../key-util.js";

/**
 * Note that this listener setups listening on document so we NEED to remove the listeners once we are done listening
 */
export default function PlayerSteeringListener() {

    var listeners = [];

    function addListener(event, keyName, callback) {
        function eventHandler (event) {
            if (parseEvent(event) === keyName) {
                event.preventDefault();
                callback();
            }
        }
        listeners.push({event: event, function: eventHandler});
        document.addEventListener(event, eventHandler);
    }

    function addKeyListeners({ left, right, onSteeringUpdate }) {
        var leftKeyPressed = false;
        var rightKeyPressed = false;
        addListener("keydown", left, function () {
            leftKeyPressed = true;
            updatePlayerSteering();
        });

        addListener("keyup", left, function () {
            leftKeyPressed = false;
            updatePlayerSteering();
        });

        addListener("keydown", right, function () {
            rightKeyPressed = true;
            updatePlayerSteering();
        });

        addListener("keyup", right, function () {
            rightKeyPressed = false;
            updatePlayerSteering();
        });

        function updatePlayerSteering() {
            var newSteering = leftKeyPressed * STEERING_LEFT + rightKeyPressed * STEERING_RIGHT;
            onSteeringUpdate(newSteering);
        }
    }

    function removeKeyListeners() {
        listeners.forEach(function(listener) {
            document.removeEventListener(listener.event, listener.function);
        });
    }

    return {
        addKeyListeners: addKeyListeners,
        removeKeyListeners: removeKeyListeners
    };
};