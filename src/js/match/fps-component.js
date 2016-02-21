var React = require('react');

//TODO: Rethink how the fps handler works (ML)
module.exports = React.createClass({
    displayName: 'FPS',

    getInitialState: function () {
        return {
            fps: 0,
            numUpdates: 0
        }
    },
    render: function () {
        return (
            <div>FPS: {this.state.fps}</div>
        )
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return this.state.fps !== nextProps.fps;
    },
    componentDidMount: function () {
        var thisComponent = this;
        this.intervalId = setInterval(function updateFps() {
            thisComponent.setState({fps: this.state.fps, numUpdates: 0});
        }, 1000);

        this.props.game.on(this.props.game.events.GAME_UPDATED, function updateFps() {
            thisComponent.setState(function (previousState, currentProps) {
                return {
                    numUpdates: previousState.numUpdates + 1
                }
            })
        });
    },
    componentWillUnmount: function () {
        clearInterval(this.intervalId);
    }
});