var React = require("react");

var requestFrame = require("../game/request-frame.js");

var HEIGHT = 19;
var BAR_RADIUS = 3;
var X_MARGIN = HEIGHT / 2;
var BALL_RADIUS = 5;
var BALL_BORDER_SIZE = 2;
var HOVER_ADDED_RADIUS = 1;

var BACKGROUND_COLOR = "#eeeeee";
var BAR_FILLED_COLOR = "black";
var BAR_EMPTY_COLOR = "#dddddd";
var BALL_COLOR = "green";
var BALL_BORDER_COLOR = "black";

module.exports = React.createClass({
    propTypes: {
        progress: React.PropTypes.any.isRequired,
        onTogglePause: React.PropTypes.func,
        onProgressChange: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            mouse: {
                hover: false,
                down: false,
                progress: 0
            }
        };
    },
    render: function () {
        return (
            <canvas ref="canvas" style={{width: "100%", height: HEIGHT, cursor: "pointer"}}/>
        );
    },
    update: function() {
        var progress = this.props.progress;
        if (typeof progress === "function") {
            progress = progress();
        }
        var canvas = this.refs.canvas;

        var context = canvas.getContext("2d");

        // Background
        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(X_MARGIN, 0, canvas.width - 2*X_MARGIN, canvas.height);
        context.beginPath();
        context.arc(X_MARGIN, canvas.height / 2, X_MARGIN, 0, 2 * Math.PI);
        context.arc(canvas.width - X_MARGIN, canvas.height / 2, X_MARGIN, 0, 2 * Math.PI);
        context.fill();

        // Empty bar
        context.lineWidth = BAR_RADIUS + (this.state.hover ? HOVER_ADDED_RADIUS : 0);
        context.lineCap = "round";
        context.strokeStyle = BAR_EMPTY_COLOR;
        context.beginPath();
        context.moveTo(X_MARGIN, canvas.height / 2);
        context.lineTo(canvas.width - X_MARGIN, canvas.height / 2);
        context.stroke();

        // Filled bar
        context.lineWidth = BAR_RADIUS + (this.state.mouse.hover ? HOVER_ADDED_RADIUS : 0);
        context.lineCap = "round";
        context.strokeStyle = BAR_FILLED_COLOR;
        context.beginPath();
        context.moveTo(X_MARGIN, canvas.height / 2 + (this.state.mouse.hover ? 0.5: 0));
        context.lineTo(X_MARGIN + (canvas.width - 2*X_MARGIN) * progress, canvas.height / 2 + (this.state.mouse.hover ? 0.5: 0));
        context.stroke();

        // Ball
        var ballProgress = this.state.mouse.down ? this.state.mouse.progress : progress;
        context.lineWidth = BALL_BORDER_SIZE;
        context.fillStyle = BALL_COLOR;
        context.strokeStyle = BALL_BORDER_COLOR;
        context.beginPath();
        context.arc(X_MARGIN + (canvas.width - 2*X_MARGIN) * ballProgress, canvas.height / 2, BALL_RADIUS + (this.state.mouse.hover ? HOVER_ADDED_RADIUS : 0), 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        this._requestId = requestFrame(this.update);
    },
    componentWillMount: function() {
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
    },
    componentWillUnmount: function() {
        window.cancelAnimationFrame(this._requestId);
        document.removeEventListener("mousedown", this.onMouseDown);
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("mousemove", this.onMouseMove);
    },
    componentDidMount() {
        var canvas = this.refs.canvas;
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this._requestId = requestFrame(this.update);
    },
    getProgressFromEvent: function(event) {
        var offsetX = event.pageX - this.refs.canvas.getBoundingClientRect().left;
        var newProgress = (offsetX - X_MARGIN) / (this.refs.canvas.width - 2*X_MARGIN);
        newProgress = Math.max(0, Math.min(1, newProgress));
        return newProgress;
    },
    onMouseDown: function (event) {
        if (event.target === this.refs.canvas) {
            event.preventDefault();
            this.state.mouse.down = true;
            this.state.mouse.progress = this.getProgressFromEvent(event);
            if (this.props.onTogglePause) {
                this.props.onTogglePause();
            }
        }
    },
    onMouseUp: function (event) {
        if (this.state.mouse.down) {
            var newProgress = this.getProgressFromEvent(event);
            this.state.mouse.down = false;
            if (this.props.onProgressChange) {
                this.props.onProgressChange(newProgress);
            }
            if (this.props.onTogglePause) {
                this.props.onTogglePause();
            }
        }
    },
    onMouseMove: function (event) {
        this.state.mouse.hover = event.target === this.refs.canvas;
        if (this.state.mouse.down) {
            this.state.mouse.progress = this.getProgressFromEvent(event);
        }
    }
});