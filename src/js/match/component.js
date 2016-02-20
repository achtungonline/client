var React = require('react');
var CoreMatchFactory = require('core/src/match-factory.js');
var GameCanvasHandler = require('./game-canvas-handler.js');
var LocalGameHandler = require('./local-game/local-game-handler.js');
var Replay = require('./local-game/replay/replay.js');
var GameHistoryHandler = require("core/src/core/history/game-history-handler.js");
var GameHistory = require("core/src/core/history/game-history.js");


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
            matchConfig: matchConfig,
            match: CoreMatchFactory().create({matchConfig: matchConfig}),
            gameHistory: null
        }
    },
    render: function () {
        var thisComponent = this;
        var currentGame = this.state.match.getCurrentGame();
        var startNextGameButton = currentGame && currentGame.isGameOver() ? <button onClick={this.startNextGame}>Start next game</button> : null;
        var replayButton = currentGame && currentGame.isGameOver() && this.state.gameHistory ? <button onClick={this.startReplay}>Watch replay</button> : null;

        var scoreTableRows = this.props.players.map(function (player) {
            return (
                <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{thisComponent.state.match.matchState.score[player.id]}</td>
                </tr>
            )
        });

        return (
            <div>
                {startNextGameButton}
                {replayButton}
                <div ref="gameCanvas"></div>
                <table>
                    <tbody>
                    {scoreTableRows}
                    </tbody>
                </table>
                <div>Max score: {this.state.match.matchState.maxScore}</div>
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

        function startGameHistoryRecording(game) {
            var gameHistory = GameHistory(game.gameState.map, thisComponent.state.matchConfig.playerConfigs, game.gameState.seed);
            thisComponent.setState({gameHistory: gameHistory});
            GameHistoryHandler().recordGameHistory(game, gameHistory);
        }

        startGameHistoryRecording(game);

        var localGame = LocalGameHandler({game: game});
        var gameCanvasHandler = GameCanvasHandler(localGame);
        var gameCanvasContainer = gameCanvasHandler.getGameCanvasContainer();
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasContainer);
        localGame.start();
        //this.state.match.startNextGame();
        thisComponent.forceUpdate();

        localGame.on("gameOver", function (phaseType) {
            // So that the startNextGameButton shows
            thisComponent.forceUpdate();
        });
    },
    startReplay: function () {
        // Replay stuff
        var gameReplay = Replay(this.state.gameHistory);
        var gameCanvasHandler = GameCanvasHandler(gameReplay);
        var gameCanvasContainer = gameCanvasHandler.getGameCanvasContainer();
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasContainer);
        gameReplay.start();
    }
});
