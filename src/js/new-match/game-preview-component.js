import React from "react";

import CoreGameFactory from "core/src/game-factory.js";
import clone from "core/src/core/util/clone.js";

import GameOverlay from "../canvas/overlays/game-overlay.js";
import GameCanvas from "../canvas/game-canvas-component.js";
import LocalGameHandler from "../game/local-game/local-game-handler.js";
import * as windowFocusHandler from "../window-focus-handler.js";

var coreGameFactory = CoreGameFactory();

export default React.createClass({
    propTypes: {
        matchConfig: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        var overlay = GameOverlay();
        overlay.startPreviewBlink();
        return {
            localGame: null,
            overlay
        };
    },
    render: function () {
        var localGame = this.state.localGame;
        return (
            <GameCanvas size="medium" gameState={localGame.gameState} players={this.props.matchConfig.players} overlay={this.state.overlay.overlay}/>
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
        if (this.state.localGame) {
            this.state.localGame.stop();
        }
        var thisComponent = this;
        var localGame = LocalGameHandler({
            game,
            players: botPlayers,
            onGameOver: function() {
                thisComponent.createGame(thisComponent.props);
            }
        });
        if (props.matchConfig.players.length > 1) {
            localGame.start();
        }
        this.setState({ localGame });
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
        this.state.localGame.resume();
    },
    onWindowBlur: function () {
        this.state.localGame.pause();
    },
    componentWillUnmount: function () {
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowBlur);
        this.state.localGame.stop();
    }
});