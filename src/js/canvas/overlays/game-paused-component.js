import React from "react";

import GameOverlayComponent from "./game-overlay-component.js";

export default React.createClass({
    render: function () {
        return (
            <GameOverlayComponent gameState={this.props.gameState} className="canvas-overlay-faded-bg canvas-center-text">
                GAME PAUSED
            </GameOverlayComponent>
        );
    }
})
