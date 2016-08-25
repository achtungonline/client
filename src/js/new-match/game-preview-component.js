var React = require("react");

var CoreGameFactory = require("core/src/game-factory.js");

var GameCanvas = require("../canvas/game-canvas-component.js");
var LocalGameHandler = require("../game/local-game/local-game-handler.js");
var windowFocusHandler = require("../window-focus-handler.js");

var coreGameFactory = CoreGameFactory();

module.exports = React.createClass({
    propTypes: {
        matchConfig: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            renderTime: 0
        };
    },
    render: function () {
        var mapBorderWidth = 10;
        var scale = 520 / (this.props.matchConfig.map.width + mapBorderWidth * 2);
        return (
            <GameCanvas gameState={this.localGame.gameState} players={this.props.matchConfig.players} renderTime={this.state.renderTime} mapBorderWidth={mapBorderWidth} scale={scale}/>
        );
    },
    createGame: function(props) {
        var game = coreGameFactory.create({
            seed: Math.floor((Math.random() * 100000)),
            map: props.matchConfig.map,
            players: props.matchConfig.players.map(function (pc) {
                return {
                    id: pc.id,
                    type: "bot"
                }
            })
        });
        if (this.localGame) {
            this.localGame.stop();
        }

        this.localGame = LocalGameHandler({game: game, playerConfigs: props.matchConfig.players});
        this.localGame.start();

        var thisComponent = this;
        this.localGame.on(this.localGame.events.GAME_UPDATED, function() {
            thisComponent.setState({ renderTime: thisComponent.localGame.gameState.gameTime });
        });
    },
    componentWillMount: function () {
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
        this.createGame(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.matchConfig.map.name !== nextProps.matchConfig.map.name || this.props.matchConfig.players.length !== nextProps.matchConfig.players.length) {
            this.createGame(nextProps);
        }
    },
    onWindowFocus: function () {
        this.localGame.resume();
    },
    onWindowBlur: function () {
        this.localGame.pause();
    },
    componentWillUnmount: function () {
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowBlur);
        if (this.localGame) {
            this.localGame.stop();
        }
    }
});