var React = require('react');
var LocalMatchFactory = require('./local-match-factory.js');
var GameAreaView = require('../game-module/game-area-module/game-area-view.js');
var LocalGameFactory = require('../game-module/local-game/local-game-factory.js');

var localMatchFactory = LocalMatchFactory();

module.exports = React.createClass({
    displayName: 'Match',
    componentWillMount: function () {

    },
    render: function () {
        return (
            <div>
                Play match component
                <div id="game-area"></div>
            </div>
        );
    },
    componentDidMount: function () {
        var options = {};
        options.playerConfigs = this.props.players.map(function (player) {
            return {
                id: player.id,
                type: player.bot ? "bot" : "human"
            }
        });
        options.seed = this.props.seed;
        var game = LocalGameFactory().create(options);

        var gameAreaView = GameAreaView(game);
        var area = gameAreaView.render();
        document.getElementById("game-area").appendChild(area);
        game.start();
    }
});
