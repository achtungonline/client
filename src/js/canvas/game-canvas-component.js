var React = require("react");

var forEach = require("core/src/core/util/for-each.js");

var MapRenderer = require("./renderers/map-renderer.js");
var WormHeadRenderer = require("./renderers/worm-head-renderer.js");
var PowerUpRenderer = require("./renderers/power-up-renderer.js");
var WormBodyRenderer = require("./renderers/worm-body-renderer.js");

module.exports = React.createClass({
    propTypes: {
        gameState: React.PropTypes.object.isRequired,
        players: React.PropTypes.array.isRequired,
        renderTime: React.PropTypes.number,
        scale: React.PropTypes.number,
        mapBorderWidth: React.PropTypes.number
    },
    getDefaultProps: function() {
        return {
            scale: 1,
            mapBorderWidth: 10
        };
    },
    getInitialState: function() {
        return {
            renderers: []
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
        this.state.renderers.length = 0;
        this.state.renderers.push(MapRenderer({
            map: this.props.gameState.map,
            canvas: this.refs.mapCanvas,
            gameState: this.props.gameState,
            borderWidth: this.props.mapBorderWidth
        }));
        this.state.renderers.push(PowerUpRenderer({
            gameState: this.props.gameState,
            canvas: this.refs.powerUpCanvas
        }));
        this.state.renderers.push(WormBodyRenderer({
            players: this.props.players,
            gameState: this.props.gameState,
            fadeCanvas: this.refs.wormBodyCanvas1,
            mainCanvas: this.refs.wormBodyCanvas2,
            secondaryCanvas: this.refs.wormBodyCanvas3
        }));
        this.state.renderers.push(WormHeadRenderer({
            players: this.props.players,
            gameState: this.props.gameState,
            canvas: this.refs.wormHeadCanvas,
            drawTrajectories: false
        }));
        this.updateRenderers(this.props.renderTime);
    },
    updateRenderers: function(renderTime) {
        if (renderTime === undefined) {
            renderTime = this.props.gameState.gameTime;
        }
        this.state.renderers.forEach(function (renderer) {
            renderer.render(renderTime);
        });
    },
    clearCanvas: function() {
        forEach(this.refs, function (canvas) {
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
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
        this.updateRenderers(nextProps.renderTime);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.gameState !== this.props.gameState;
    },
});