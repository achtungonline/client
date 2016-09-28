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
        renderTime: React.PropTypes.any.isRequired,
        scale: React.PropTypes.number,
        mapBorderWidth: React.PropTypes.number,
        overlay: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            scale: 1,
            mapBorderWidth: 10
        };
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
    createCanvas: function(name, width, height, padding) {
        var style = {width: width*this.props.scale, height: height*this.props.scale};
        if (padding) {
            style.padding = padding;
        }
        return (
            <canvas className={name} ref={name} width={width} height={height} style={style} />
        );
    },
    render: function() {
        var mapBoundingBox = this.props.gameState.map.shape.boundingBox;
        var canvasWidth = mapBoundingBox.width;
        var canvasHeight = mapBoundingBox.height;
        var borderCanvasWidth = canvasWidth + this.props.mapBorderWidth*2;
        var borderCanvasHeight= canvasHeight + this.props.mapBorderWidth*2;
        var padding = this.props.mapBorderWidth*this.props.scale;

        return (
            <div className="ao-game-area">
                <div className="canvas-container" style={{width: borderCanvasWidth*this.props.scale, height: borderCanvasHeight*this.props.scale}}>
                    {this.createCanvas("mapCanvas", borderCanvasWidth, borderCanvasHeight)}
                    {this.createCanvas("powerUpCanvas", canvasWidth, canvasHeight, padding)}
                    {this.createCanvas("wormBodyCanvas1", canvasWidth, canvasHeight, padding)}
                    {this.createCanvas("wormBodyCanvas2", canvasWidth, canvasHeight, padding)}
                    {this.createCanvas("wormBodyCanvas3", canvasWidth, canvasHeight, padding)}
                    {this.createCanvas("wormHeadCanvas", canvasWidth, canvasHeight, padding)}
                    {this.props.overlay ? this.createCanvas("overlayCanvas", canvasWidth, canvasHeight, padding) : null}
                </div>
            </div>
        )
    },
    setupRenderers: function() {
        var renderers = this.state.renderData.renderers;
        renderers.length = 0;
        renderers.push(MapRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.mapCanvas,
            borderWidth: this.props.mapBorderWidth
        }));
        renderers.push(PowerUpRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.powerUpCanvas
        }));
        renderers.push(WormBodyRenderer({
            gameState: this.props.gameState,
            players: this.props.players,
            fadeCanvas: this.refs.wormBodyCanvas1,
            mainCanvas: this.refs.wormBodyCanvas2,
            secondaryCanvas: this.refs.wormBodyCanvas3
        }));
        renderers.push(WormHeadRenderer({
            gameState: this.props.gameState,
            players: this.props.players,
            canvas: this.refs.wormHeadCanvas,
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