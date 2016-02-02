var React = require('react');
var LocalMatchFactory = require('./local-match-factory.js');

var localMatchFactory = LocalMatchFactory();

module.exports = React.createClass({
    displayName: 'Match',
    componentWillMount: function () {
        var options = {};
        options.playerConfigs = this.props.players.map(function (player) {
            return {
                id: player.id,
                type: player.bot ? "bot" : "human"
            }
        });
        options.seed = this.props.seed;
        var match = localMatchFactory.create(options);
    },
    render: function () {
        return (
            <div>
                Play match component
            </div>
        );
    }
});
