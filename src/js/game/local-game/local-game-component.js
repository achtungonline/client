import React from "react";

import clone from "core/src/core/util/clone.js";
import * as random from "core/src/core/util/random.js";
import * as scoreUtil from "core/src/core/score/score-util.js";
import * as gsf from "core/src/core/game-state-functions.js";

import PlayerSteeringListener from "../player-steering-listener.js";
import * as windowFocusHandler from "../../window-focus-handler.js";
import LocalGameHandler from "./local-game-handler.js";
import GameCanvas from "../../canvas/game-canvas-component.js";
import Score from "../score-component.js";
import {parseEvent, CONTINUE_KEY} from "../../key-util.js";
import * as clientConstants from "../../constants.js"
import GamePausedComponent from "../../canvas/overlays/game-paused-component.js";
import GameCountdownComponent from "../../canvas/overlays/game-countdown-component.js";


var playerSteeringListener = PlayerSteeringListener();

export default React.createClass({
    displayName: "Local Game",
    propType: {
        match: React.PropTypes.object.isRequired,
        overlay: React.PropTypes.object,
        onGameOverAction: React.PropTypes.func
    },
    getInitialState: function () {
        var startScore = scoreUtil.getStartScore(this.props.match.matchConfig.players);
        if (this.props.match.matchState.roundsData.length > 0) {
            startScore = this.props.match.matchState.roundsData[this.props.match.matchState.roundsData.length - 1].endScore;
        }
        return {
            localGame: null,
            startScore: startScore,
            pausedDueToLostFocus: false
        }
    },
    render: function () {
        var match = this.props.match;
        var game = this.state.localGame;
        var players = match.matchConfig.players;
        var pauseButton = <button className="btn btn-primary" onClick={this.togglePause}>{game.isPaused() ? "Resume" : "Pause"}</button>;
        var endGameButton = <button className="btn btn-secondary" onClick={this.endGame}>End game</button>;

        return (
            <div className="flex">
                <div className="m-b-2" style={{width: clientConstants.DEFAULT_VISUAL_MAP_SIZES.large, height: clientConstants.DEFAULT_VISUAL_MAP_SIZES.large}}>
                    <GameCanvas config={{size: clientConstants.DEFAULT_VISUAL_MAP_SIZES.large}} gameState={game.gameState} players={players}>
                        { game.isPaused() ? <GamePausedComponent gameState={game.gameState}/> : null}
                        <GameCountdownComponent gameState={game.gameState} getRenderTime={() => game.gameState.gameTime}/>
                    </GameCanvas>
                </div>
                <div className="m-l-2" style={{flex: "1 0 auto"}}>
                    <Score gameState={game.gameState} players={players} startScore={this.state.startScore} maxScore={match.matchConfig.maxScore}/>
                    <div className="m-t-2">
                        <div>
                            {pauseButton}
                        </div>
                        <div>
                            {endGameButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    componentWillMount: function () {
        var thisComponent = this;
        this.createGame();
        this.props.match.matchConfig.players.forEach(function (player) {
            if (player.type === "human") {
                var onSteeringUpdate = steering => {
                    gsf.setPlayerSteering(thisComponent.state.localGame.gameState, player.id, steering);
                };
                playerSteeringListener.addKeyListeners({left: player.left, right: player.right, onSteeringUpdate});
            }
        });
        windowFocusHandler.on("focus", this.onWindowFocus);
        windowFocusHandler.on("blur", this.onWindowBlur);
    },
    componentDidMount: function () {
        document.addEventListener("keydown", this.onKeyDown);
    },
    componentWillUnmount: function () {
        playerSteeringListener.removeKeyListeners();
        document.removeEventListener("keydown", this.onKeyDown);
        windowFocusHandler.off("focus", this.onWindowFocus);
        windowFocusHandler.off("blur", this.onWindowBlur);
    },
    onKeyDown: function (event) {
        var newKey = parseEvent(event);
        if (newKey === CONTINUE_KEY) {
            this.togglePause();
        }
    },
    togglePause: function () {
        if (this.state.localGame.isPaused()) {
            this.state.localGame.resume();
        } else {
            this.state.localGame.pause();
        }
        this.forceUpdate();
    },
    createGame: function () {
        var seed = random.generateSeed();
        var game = this.props.match.prepareNextGame(seed);

        var localGame = LocalGameHandler({
            game,
            onGameOver: this.onGameOver
        });
        localGame.start();

        this.setState({localGame: localGame});
    },
    endGame: function () {
        this.state.localGame.stop();
        this.onGameOver();
    },
    onGameOver: function () {
        this.props.match.addFinishedGameState(this.state.localGame.gameState);
        if (this.props.onGameOverAction) {
            this.props.onGameOverAction();
        }
    },
    onWindowFocus: function () {
        if (this.state.pausedDueToLostFocus) {
            this.state.localGame.resume();
            this.setState({
                pausedDueToLostFocus: false
            });
        }
    },
    onWindowBlur: function () {
        if (!this.state.localGame.isPaused()) {
            this.state.localGame.pause();
            this.setState({
                pausedDueToLostFocus: true
            });
        }
    }
});
