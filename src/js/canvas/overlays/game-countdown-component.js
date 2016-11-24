import React from "react";
import * as gsf from "core/src/core/game-state-functions.js";

import GameOverlayComponent from "./game-overlay-component.js";

export default React.createClass({
    render: function () {
        var timeLeft = this.props.gameState.startPhaseTime - this.props.getRenderTime();
        var text = timeLeft > 0 ? Math.ceil(timeLeft) : "GO";
        var opacity = (timeLeft - Math.floor(timeLeft)) * 0.8;
        var fontSize = (timeLeft - Math.floor(timeLeft)) * 200;
        if(timeLeft <= -1 ) {
            return null;
        }
        return (
            <GameOverlayComponent gameState={this.props.gameState} className="canvas-overlay-text">
                <div style={{opacity, fontSize}}>{text}</div>
            </GameOverlayComponent>
        );
    },
    componentDidMount: function() {
        this.intervalId = setInterval(() => (this.forceUpdate()), 10);
    },
    componentWillUnmount: function() {
        window.clearInterval(this.intervalId);
    }
})
