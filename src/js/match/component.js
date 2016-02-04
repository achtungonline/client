var React = require('react');
var LocalMatchFactory = require('./local-match-factory.js');
var GameAreaView = require('../game-module/game-area-module/game-area-view.js');
var LocalGameFactory = require('../game-module/local-game/local-game-factory.js');
var GameFactory = require('../game-module/game-factory.js');

var localMatchFactory = LocalMatchFactory();

module.exports = React.createClass({
    displayName: 'Match',
    componentWillMount: function () {

    },
    render: function () {
        return (
            <div>
                Play match component
                <div ref="gameArea"></div>
                <div ref="replayArea"></div>
            </div>
        );
    },
    componentDidMount: function () {
        var thisComponent = this;

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
        var gameHistory = game.startGameHistoryRecording();

        var area = gameAreaView.render();
        var container = this.refs.gameArea;
        container.innerHTML = "";
        container.appendChild(area);
        game.start();

        game.on("gameOver", function (phaseType) {
            var gameFactory = GameFactory();
            var gameReplay = gameFactory.createReplay(gameHistory);
            var gameAreaView = GameAreaView(gameReplay);

            var area = gameAreaView.render();
            var container = thisComponent.refs.replayArea;
            container.innerHTML = "";
            container.appendChild(area);
            gameReplay.start();
        });
    }
});
