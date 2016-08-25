var React = require("react");

var HEIGHT = 20;
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
        progress: React.PropTypes.number,
        onProgressClick: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            progress: 0
        };
    },
    getInitialState: function() {
        return {
            mouseState: {
                hover: false,
                down: false
            }
        };
    },
    updateCanvas: function(progress) {
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
        context.lineWidth = BAR_RADIUS + (this.state.hover ? HOVER_ADDED_RADIUS : 0);
        context.lineCap = "round";
        context.strokeStyle = BAR_FILLED_COLOR;
        context.beginPath();
        context.moveTo(X_MARGIN, canvas.height / 2);
        context.lineTo(X_MARGIN + (canvas.width - 2*X_MARGIN) * progress, canvas.height / 2);
        context.stroke();

        // Ball
        context.lineWidth = BALL_BORDER_SIZE;
        context.fillStyle = BALL_COLOR;
        context.strokeStyle = BALL_BORDER_COLOR;
        context.beginPath();
        context.arc(X_MARGIN + (canvas.width - 2*X_MARGIN) * progress, canvas.height / 2, BALL_RADIUS + (this.state.hover ? HOVER_ADDED_RADIUS : 0), 0, 2 * Math.PI);
        context.fill();
        context.stroke();
    },
    componentWillReceiveProps: function(nextProps) {
        this.updateCanvas(nextProps.progress);
    },
    shouldComponentUpdate: function() {
        return false;
    },
    componentDidMount() {
        var canvas = this.refs.canvas;
        canvas.onmouseenter = this.onMouseEnter;
        canvas.onmouseleave = this.onMouseLeave;
        canvas.onmousedown = this.onMouseDown;
        canvas.onmouseup = this.onMouseUp;
        canvas.style.width = "100%";
        canvas.style.height = HEIGHT;
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.updateCanvas(this.props.progress);
    },
    onMouseEnter: function(e) {
        this.state.hover = true;
        this.updateCanvas(this.props.progress);
    },
    onMouseLeave: function(e) {
        this.state.hover = false;
        this.state.down = false;
        this.updateCanvas(this.props.progress);
    },
    onMouseDown: function(e) {
        this.state.down = true;
    },
    onMouseUp: function(e) {
        if (this.state.down) {
            var newProgress = (e.offsetX - X_MARGIN) / (this.refs.canvas.width - 2*X_MARGIN);
            newProgress = Math.max(0, Math.min(1, newProgress));
            if (this.props.onProgressClick) {
                this.props.onProgressClick(newProgress);
            }
        }
    },
    render: function () {
        return (
            <canvas ref="canvas" />
        );
    },
});