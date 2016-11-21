import React from "react";

import * as gsf from "core/src/core/game-state-functions.js"

export default React.createClass({
    render: function() {
        return (
            <div {...this.props} className={(this.props.className + " " || "") + (gsf.isRoundMap(this.props.gameState) ? "canvas-overlay-container-round" : "canvas-overlay-container")}></div>
        );
    }
})
