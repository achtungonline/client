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
        config: React.PropTypes.object,
        renderTime: React.PropTypes.any,
        overlay: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            config: {}
        };
    },
    getInitialState: function () {
        return {canvasState: csf.createState()};
    },
    render: function () {
        return (
            <div className="canvas-container" style={
                {
                    width: this.props.config.width || this.props.config.size || this.props.gameState.map.width,
                    height: this.props.config.height || this.props.config.size || this.props.gameState.map.height}
                }>
                <canvas ref="mapCanvas" className="map-canvas"/>
                <canvas ref="powerUpCanvas" className="power-up-canvas"/>
                <canvas ref="wormBodyCanvas1" className="worm-body-canvas-1"/>
                <canvas ref="wormBodyCanvas2" className="worm-body-canvas-2"/>
                <canvas ref="wormBodyCanvas3" className="worm-body-canvas-3"/>
                <canvas ref="wormHeadCanvas" className="worm-head-canvas"/>
                <canvas ref="borderCanvas" className="border-canvas"/>
                {this.props.overlay ? <canvas ref="overlayCanvas"/> : null}
                {this.props.children}
            </div>
        )
    },
    resizeCanvases: function () {
        forEach(this.refs, canvas => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    },
    setupRenderers: function () {
        var scale = this.refs.mapCanvas.width / this.props.gameState.map.width;
        var renderers = this.state.canvasState.renderers;
        renderers.length = 0;
        renderers.push(MapRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.mapCanvas,
            borderCanvas: this.refs.borderCanvas,
            centerText: this.props.config.centerText,
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
            canvasState: this.state.canvasState,
            players: this.props.players,
            canvas: this.refs.wormHeadCanvas,
            scale,
            drawTrajectories: false
        }));
        if (this.props.overlay) {
            this.state.canvasState.overlay = this.props.overlay.createRenderer({
                gameState: this.props.gameState,
                players: this.props.players,
                canvas: this.refs.overlayCanvas,
                scale
            });
        }
    },
    update: function () {
        var renderTime = this.props.renderTime;
        if (typeof renderTime === "function") {
            renderTime = renderTime();
        } else if (renderTime === undefined) {
            renderTime = this.props.gameState.gameTime;
        }
        this.state.canvasState.renderers.forEach(function (renderer) {
            renderer.render(renderTime);
        });
        if (this.props.overlay) {
            this.state.canvasState.overlay.render(renderTime);
        }
        this.state.canvasState.requestId = requestFrame(this.update);
        this.state.canvasState.prevRenderTime = renderTime;
    },
    clear: function () {
        csf.clearPathSegmentRenderData(this.state);
        forEach(this.refs, function (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        });
    },
    componentDidMount: function () {
        this.resizeCanvases();
        this.setupRenderers();
        this.update();
    },
    componentDidUpdate: function () {
        this.clear();
        this.setupRenderers();
    },
    componentWillUnmount: function () {
        window.cancelAnimationFrame(this.state.canvasState.requestId);
    }
});