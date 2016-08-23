var React = require("react");

var forEach = require("core/src/core/util/for-each.js");

var MapRenderer = require("./renderers/map-renderer.js");
var WormHeadRenderer = require("./renderers/worm-head-renderer.js");
var PowerUpRenderer = require("./renderers/power-up-renderer.js");
var WormBodyRenderer = require("./renderers/worm-body-renderer.js");

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            gameState: null,
            playerConfigs: null,
            renderTime: 0,
            scale: 1,
            mapBorderWidth: 10
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
                </div>
            </div>
        )
    },
    setupRenderers: function() {
        this.mapRenderer = MapRenderer({
            map: this.props.gameState.map,
            canvas: this.refs.mapCanvas,
            gameState: this.props.gameState,
            borderWidth: this.props.mapBorderWidth
        });
        this.powerUpRenderer = PowerUpRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.powerUpCanvas
        });
        this.wormBodyRenderer = WormBodyRenderer({
            playerConfigs: this.props.playerConfigs,
            gameState: this.props.gameState,
            fadeCanvas: this.refs.wormBodyCanvas1,
            mainCanvas: this.refs.wormBodyCanvas2,
            secondaryCanvas: this.refs.wormBodyCanvas3
        });
        this.wormHeadRenderer = WormHeadRenderer({
            playerConfigs: this.props.playerConfigs,
            gameState: this.props.gameState,
            canvas: this.refs.wormHeadCanvas,
            drawTrajectories: false
        });
        this.updateRenderers(this.props.renderTime);
    },
    updateRenderers: function(renderTime) {
        this.mapRenderer.render(renderTime);
        this.wormHeadRenderer.render(renderTime);
        this.powerUpRenderer.render(renderTime);
        this.wormBodyRenderer.render(renderTime);
    },
    clearCanvas: function() {
        forEach(this.refs, function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        });
    },
    componentDidMount: function() {
        this.setupRenderers();
    },
    componentDidUpdate: function() {
        this.clearCanvas();
        this.setupRenderers();
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.mapRenderer) { // TODO Why does this sometimes happen before mounting?
            this.updateRenderers(nextProps.renderTime);
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.gameState !== this.props.gameState;
    },
});