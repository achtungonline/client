var React = require("react");

var CoreGameFactory = require("core/src/game-factory.js");
var clone = require("core/src/core/util/clone.js");

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
        var botPlayers = props.matchConfig.players.map(player => clone(player));
        botPlayers.forEach(p => p.type = "bot");
        var game = coreGameFactory.create({
            seed: Math.floor((Math.random() * 100000)),
            map: props.matchConfig.map,
            players: botPlayers
        });
        if (this.localGame) {
            this.localGame.stop();
        }

        var thisComponent = this;
        this.localGame = LocalGameHandler({
            game: game,
            players: botPlayers,

            onGameUpdated: function() {
                thisComponent.setState({ renderTime: thisComponent.localGame.gameState.gameTime });
            },
            onGameOver: function() {
                if (thisComponent.localGame && !thisComponent.localGame.isActive()) {
                    // Game ended. Start it again
                    thisComponent.createGame(thisComponent.props);
                }
            }
        });
        this.localGame.start();
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
            var localGame = this.localGame;
            this.localGame = null;
            localGame.stop();
        }
    }
});