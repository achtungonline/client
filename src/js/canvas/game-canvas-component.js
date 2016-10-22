import React from "react";

import forEach from "core/src/core/util/for-each.js";

import requestFrame from "../game/request-frame.js";
import MapRenderer from "./renderers/map-renderer.js";
import WormHeadRenderer from "./renderers/worm-head-renderer.js";
import PowerUpRenderer from "./renderers/power-up-renderer.js";
import WormBodyRenderer from "./renderers/worm-body-renderer.js";
import * as csf from "./canvas-state-functions.js";

export default React.createClass({
    propTypes: {
        gameState: React.PropTypes.object.isRequired,
        players: React.PropTypes.array.isRequired,
        size: React.PropTypes.string,
        renderTime: React.PropTypes.any,
        overlay: React.PropTypes.object
    },
    getInitialState: function() {
        return csf.createState();
    },
    render: function() {
        var className = "canvas-container", style;
        if (this.props.size) {
            if (this.props.size === "small") {
                className += " game-area-small";
            } else if (this.props.size === "medium") {
                className += " game-area-medium";
            } else if (this.props.size === "large") {
                className += " game-area-large";
            } else {
                className += " " + this.props.size;
            }
        } else {
            style = {width: this.props.gameState.map.width, height: this.props.gameState.map.height};
        }
        return (
            <div className={className} style={style}>
                <canvas ref="mapCanvas"/>
                <canvas ref="powerUpCanvas"/>
                <canvas ref="wormBodyCanvas1"/>
                <canvas ref="wormBodyCanvas2"/>
                <canvas ref="wormBodyCanvas3"/>
                <canvas ref="wormHeadCanvas"/>
                <canvas ref="borderCanvas"/>
                {this.props.overlay ? <canvas ref="overlayCanvas" /> : null}
            </div>
        )
    },
    resizeCanvases: function() {
        forEach(this.refs, canvas => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    },
    setupRenderers: function() {
        var scale = this.refs.mapCanvas.width / this.props.gameState.map.width;
        var renderers = this.state.renderers;
        renderers.length = 0;
        renderers.push(MapRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.mapCanvas,
            borderCanvas: this.refs.borderCanvas,
            scale
        }));
        renderers.push(PowerUpRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.powerUpCanvas,
            scale
        }));
        renderers.push(WormBodyRenderer({
            gameState: this.props.gameState,
            players: this.props.players,
            fadeCanvas: this.refs.wormBodyCanvas1,
            mainCanvas: this.refs.wormBodyCanvas2,
            secondaryCanvas: this.refs.wormBodyCanvas3,
            scale
        }));
        renderers.push(WormHeadRenderer({
            gameState: this.props.gameState,
            players: this.props.players,
            canvas: this.refs.wormHeadCanvas,
            scale,
            drawTrajectories: false
        }));
        if (this.props.overlay) {
            this.state.overlay = this.props.overlay.createRenderer({
                gameState: this.props.gameState,
                players: this.props.players,
                canvas: this.refs.overlayCanvas,
                scale
            });
        }
    },
    update: function() {
        var renderTime = this.props.renderTime;
        if (typeof renderTime === "function") {
            renderTime = renderTime();
        } else if (renderTime === undefined) {
            renderTime = this.props.gameState.gameTime;
        }
        this.state.renderers.forEach(function (renderer) {
            renderer.render(renderTime);
        });
        if (this.props.overlay) {
            this.state.overlay.render(renderTime);
        }
        this.state.requestId = requestFrame(this.update);
    },
    clearCanvas: function() {
        forEach(this.refs, function (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        });
    },
    componentDidMount: function() {
        this.resizeCanvases();
        this.setupRenderers();
        this.update();
    },
    componentDidUpdate: function() {
        this.clearCanvas();
        this.setupRenderers();
    },
    componentWillUnmount: function() {
        window.cancelAnimationFrame(this.state.requestId);
    }
});