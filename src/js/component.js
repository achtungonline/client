var React = require('react');

var NewGameComponent = require('./newGame/component.js');
var PlayGameComponent = require('./playGame/component.js');

module.exports = React.createClass({
    displayName: "PlayGame",
    getInitialState: function () {
        return {gameState: this.props.initialGameState || "newGame"}
    },
    render: function () {
        if (this.state.gameState === "newGame") {
            return <NewGameComponent playGameAction={this.playGameAction}/>
        } else {
            return <PlayGameComponent/>
        }
    },
    playGameAction() {
        this.setState({gameState: "playGame"});
    }
});
