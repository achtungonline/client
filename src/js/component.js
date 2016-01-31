var React = require('react');

var NewMatchComponent = require('./newMatch/component.js');
var PlayMatchComponent = require('./match/component.js');

module.exports = React.createClass({
    displayName: "TopComponent",
    getInitialState: function () {
        return {
            matchState: this.props.initialMatchState || "newMatch",
            players: []
        }
    },
    render: function () {
        if (this.state.matchState === "newMatch") {
            return <NewMatchComponent startMatchAction={this.startMatchAction}/>
        } else {
            return <PlayMatchComponent players={this.state.players}/>
        }
    },
    startMatchAction: function(players) {
        this.setState({players: players}); //TODO: Discuss, should all player changing logic be in the component? Or maybe a playersChange(players) function to NewMatchComponent?
        this.setState({matchState: "match"});
    }
});
