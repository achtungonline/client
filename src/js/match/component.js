var React = require('react');
var CoreMatchFactory = require('core/src/match-factory.js');
var GameCanvasHandler = require('./game-canvas-handler.js');
var LocalGameHandler = require('./local-game-handler.js');
//var GameFactory = require('../game-module/game-factory.js');

module.exports = React.createClass({
    displayName: 'Match',
    getInitialState: function () {
        var matchConfig = {};
        matchConfig.playerConfigs = this.props.players.map(function (player) {
            return {
                id: player.id,
                type: player.bot ? "bot" : "human"
            }
        });
        matchConfig.maxScore = 15;
        return {
            match: CoreMatchFactory().create({matchConfig: matchConfig})
        }
    },
    render: function () {
        var thisComponent = this;
        var currentGame = this.state.match.getCurrentGame();
        var startNextGameButton = currentGame && currentGame.isGameOver() ? <button onClick={this.startNextGame}>Start next game</button> : null;

        var scoreTableRows = this.props.players.map(function (player) {
            return (
                <tr>
                    <td>{player.name}</td>
                    <td>{thisComponent.state.match.matchState.score[player.id]}</td>
                </tr>
            )
        });

        return (
            <div>
                {startNextGameButton}
                <div ref="gameCanvas"></div>
                <table>
                    {scoreTableRows}
                </table>
                <div>Max score: {this.state.match.matchState.maxScore}</div>
                <div ref="replay"></div>
            </div>
        );
    },
    componentDidMount: function () {
        var thisComponent = this;
        var match = this.state.match;
        match.on(match.events.MATCH_OVER, function () {
            thisComponent.props.onMatchOverAction(match.matchState);
        });
        match.on(match.events.SCORE_UPDATED, function () {
            thisComponent.forceUpdate();
        });
        this.startNextGame();
    },
    startNextGame: function () {
        var seed = Math.random();
        var thisComponent = this;
        var game = this.state.match.prepareNextGame(seed);
        var localGame = LocalGameHandler({game: game});

        var gameCanvasHandler = GameCanvasHandler(localGame);
        var gameHistory = localGame.startGameHistoryRecording();
        var gameCanvasContainer = gameCanvasHandler.getGameCanvasContainer();
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasContainer);
        localGame.start();
        //this.state.match.startNextGame();
        thisComponent.forceUpdate();

        localGame.on("gameOver", function (phaseType) {
            //    // Replay stuff
            //    var gameFactory = GameFactory();
            //    var gameReplay = gameFactory.createReplay(gameHistory);
            //    var gameAreaView = GameCanvasHandler(gameReplay);
            //    var area = gameAreaView.render();
            //    var container = thisComponent.refs.replay;
            //    container.innerHTML = "";
            //    container.appendChild(area);
            //    gameReplay.start();
            //
            // So that the startNextGameButton shows
            thisComponent.forceUpdate()
        });
    }
});
