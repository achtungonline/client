var GameFactory = require('./game-module/game-factory.js');
var GameControllerFactory = require('./game-module/game-controller-factory.js');

function WindowFocusHandler() {
    var focusListeners = [];
    var blurListeners = [];

    function init() {
        function onWindowFocus() {
            console.log("window focus");
            focusListeners.forEach(function (listener) {
                listener();
            });
        }

        function onWindowBlur() {
            console.log("window blur");
            blurListeners.forEach(function (listener) {
                listener();
            });
        }

        // This code is super ugly! Want to rewrite it. Cluttering the document body className and stuff :(
        // Taken from http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
        (function() {
            var hidden = "hidden";

            // Standards:
            if (hidden in document)
                document.addEventListener("visibilitychange", onchange);
            else if ((hidden = "mozHidden") in document)
                document.addEventListener("mozvisibilitychange", onchange);
            else if ((hidden = "webkitHidden") in document)
                document.addEventListener("webkitvisibilitychange", onchange);
            else if ((hidden = "msHidden") in document)
                document.addEventListener("msvisibilitychange", onchange);
            // IE 9 and lower:
            else if ("onfocusin" in document)
                document.onfocusin = document.onfocusout = onchange;
            // All others:
            else
                window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

            function onchange (evt) {
                var v = "visible", h = "hidden",
                    evtMap = {
                      focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
                    };

                evt = evt || window.event;
                if (evt.type in evtMap) {
                    if (evtMap[evt.type] === v) {
                        onWindowFocus();
                    } else {
                        onWindowBlur();
                    }
                } else {
                    if (this[hidden]) {
                        onWindowBlur();
                    } else {
                        onWindowFocus();
                    }
                }
            }

            // set the initial state (but only if browser supports the Page Visibility API)
            if( document[hidden] !== undefined ) onchange({type: document[hidden] ? "blur" : "focus"});
        })();
    }

    init();

    function addFocusListener(callback) {
        focusListeners.push(callback);
    }

    function addBlurListener(callback) {
        blurListeners.push(callback);
    }

    return {
        onFocus: addFocusListener,
        onBlur: addBlurListener
    };
}

document.addEventListener("DOMContentLoaded", function(event) {
    var gameContainer = document.getElementById("game-container");
    var replayContainer = document.getElementById("replay-container");
    var gameFactory = GameFactory();
    var game = gameFactory.createGame();
    var gameHistory = game.startGameHistoryRecording();

    var gameController = GameControllerFactory(game).create();
    gameContainer.innerHTML = "";
    gameContainer.appendChild(gameController.view.render());

    var windowFocusHandler = WindowFocusHandler();

    game.start(gameContainer);

    windowFocusHandler.onFocus(function () {
        setTimeout(function () {
            game.resume();
        }, 1000);
    });
    windowFocusHandler.onBlur(function () {
        game.pause();
    });

    // Not very pretty, but temporary solution to start a replay after the game
    game.on("gameOver", function (phaseType) {
        var gameReplay = gameFactory.createReplay(gameHistory);
        var gameReplayController = GameControllerFactory(gameReplay).create();
        replayContainer.innerHTML = "";
        replayContainer.appendChild(gameReplayController.view.render());
        gameReplay.start(replayContainer);
    });
});