var React = require("react");

var forEach = require("core/src/core/util/for-each.js");

var requestFrame = require("../game/request-frame.js");
var MapRenderer = require("./renderers/map-renderer.js");
var WormHeadRenderer = require("./renderers/worm-head-renderer.js");
var PowerUpRenderer = require("./renderers/power-up-renderer.js");
var WormBodyRenderer = require("./renderers/worm-body-renderer.js");

module.exports = React.createClass({
    propTypes: {
        gameState: React.PropTypes.object.isRequired,
        players: React.PropTypes.array.isRequired,
        size: React.PropTypes.string,
        renderTime: React.PropTypes.any,
        overlay: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            renderData: {
                renderers: [],
                overlay: undefined,
                requestId: undefined
            }
        };
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
        var renderers = this.state.renderData.renderers;
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
            this.state.renderData.overlay = this.props.overlay({
                gameState: this.props.gameState,
                players: this.props.players,
                canvas: this.refs.overlayCanvas
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
        this.state.renderData.renderers.forEach(function (renderer) {
            renderer.render(renderTime);
        });
        if (this.props.overlay) {
            this.state.renderData.overlay.render(renderTime);
        }
        this.state.renderData.requestId = requestFrame(this.update);
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
        window.cancelAnimationFrame(this.state.renderData.requestId);
    }
});