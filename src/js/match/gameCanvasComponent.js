var React = require("react");
var GameCanvasHandler = require("./canvas/game-canvas-handler.js");
var LocalGameHandler = require("./local-game/local-game-handler.js");
var ReplayGameHandler = require("./local-game/replay/replay-game-handler.js");
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameHistory = require("core/src/core/history/game-history.js");
var ScoreHandler = require("core/src/core/score-handler.js");
var clone = require("core/src/core/util/clone.js");
var random = require("core/src/core/util/random.js");

var FPS = require("./fps-component.js");
var scoreUtils = require("./../score-utils.js");
var windowFocusHandler = require("../window-focus-handler.js");

var Score = require("./scoreComponent.js");
var GameCanvas = require("./gameCanvasComponent.js");

module.exports = React.createClass({
    displayName: "Game",
    getDefaultProps: function () {
        return {
            renderBotTrajectories: false,
            players: null,
            game: null
        };
    },
    render: function () {
        return (
            <div ref="gameCanvas"></div>
        );
    },
    componentDidMount: function () {
        var thisComponent = this;
        var game = this.props.game;

        this.prepareGameForCanvas(this.props.game);
    },
    componentWillReceiveProps: function (newProps) {
        if (this.props.game !== newProps.game) {
            this.prepareGameForCanvas(newProps.game);
        }
    },
    prepareGameForCanvas: function (game) {
        var gameCanvasHandler = GameCanvasHandler({game: game, playerConfigs: this.props.players, drawBotTrajectories: this.props.renderBotTrajectories});
        var gameCanvasContainer = gameCanvasHandler.getGameCanvasContainer();
        var container = this.refs.gameCanvas;
        if (container) {
            container.innerHTML = "";
            container.appendChild(gameCanvasContainer);
        }
    }
});
