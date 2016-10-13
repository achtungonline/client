var ReactDOM = require("react-dom");
var React = require("react");

import Match from "core/src/core/match.js";
import forEach from "core/src/core/util/for-each.js";
import * as gsf from "core/src/core/game-state-functions.js";
import compression from "core/src/core/util/compression.js";

var KeyUtil = require("./key-util.js");
var availableKeyBindings = require("./key-util.js").keyPairs;
var windowFocusHandler = require("./window-focus-handler.js");
var NewMatchComponent = require("./new-match/new-remote-match-component.js");
var RemoteGameComponent = require("./game/remote-game/remote-game-component.js");
var Header = require("./header/header-component.js");
var ReplayComponent = require("./replay/replay-component.js");
var GameOverComponent = require("./game-over/game-over-component.js");
var MatchOverComponent = require("./match-over/match-over-component.js");
var GameOverlay = require("./canvas/overlays/game-overlay.js");

var io = require("socket.io-client");

function setupSocket() {
    var socket = io("http://localhost:3000");
    socket.on("connect", function () {
        console.log("Connected to server");
    });
    socket.on("disconnect", function () {
        console.log("Disconnected from server");
    });
    return socket;
}

var Component = React.createClass({
    displayName: "Multi-player Component",
    propTypes: {
        socket: React.PropTypes.object.isRequired,
        initialView: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            initialView: "start"
        };
    },
    getInitialState: function () {
        return {
            previousView: this.props.initialView,
            currentView: this.props.initialView,
            overlay: GameOverlay(),
            playerData: {
                name: "",
                left: availableKeyBindings[0].left,
                right: availableKeyBindings[0].right
            },
            matchConfig: null,
            match: null,
            gameState: null,
            replayRoundId: undefined
        };
    },
    render: function () {
        var page;
        if (this.state.currentView === "start") {
            page =
                <div className="multi-player-enter">
                    <input ref="name_input" className="input" type="text"
                           onChange={this.onNameChange}
                           onKeyUp={event => {
                               var keyName = KeyUtil.parseEvent(event);
                               if (keyName === "ENTER") {
                                   this.enter();
                               }
                           }}
                           value={this.state.playerData.name}
                           maxLength="20"
                    />
                    <button className="btn btn-primary" onClick={this.enter}>Enter</button>
                </div>;
        } else if (this.state.currentView === "waiting") {
            page =
                <div className="multi-player-enter">
                    Waiting for server...
                </div>;
        } else if (this.state.currentView === "new-match") {
            page =
                <NewMatchComponent
                    matchConfig={this.state.matchConfig}
                    playerData={this.state.playerData}
                    onReadyAction={this.ready}
                    onColorChange={newColorId => this.props.socket.emit("color_change", newColorId)}
                    onLeaveAction={this.leave}
                />;
        } else if (this.state.currentView === "game") {
            page =
                <RemoteGameComponent
                    match={this.state.match}
                    playerData={this.state.playerData}
                    gameState={this.state.gameState}
                    overlay={this.state.overlay}
                    onSteeringUpdate={steering => this.props.socket.emit("player_steering", steering)}
                    onLeaveAction={this.leave}
                />;
        } else if (this.state.currentView === "replay-round") {
            page =
                <div className="m-x-3">
                    <ReplayComponent
                        match={this.state.match}
                        roundId={this.state.replayRoundId}
                        overlay={this.state.overlay}
                        onReplayOver={() => {
                            if (this.state.currentView === "replay-round") {
                                this.changeView(this.state.previousView);
                            }
                        }}
                    />
                </div>;
        } else if (this.state.currentView === "game-over") {
            page = <GameOverComponent
                match={this.state.match}
                overlay={this.state.overlay}
                onReplayAction={this.replayLastRound}
                onMatchOverAction={this.leave}
            />;
        } else if (this.state.currentView === "match-over") {
            page = <MatchOverComponent
                match={this.state.match}
                onRestartAction={this.enter}
                onRoundClick={this.replayRound}
                onExitAction={this.leave}
            />;
        } else {
            throw new Error("Unknown currentView: " + this.state.currentView);
        }

        return (
            <div className="page-center">
                <Header/>
                {page}
            </div>
        );
    },
    changeView: function (view) {
        this.setState({previousView: this.state.currentView, currentView: view})
    },
    componentWillMount: function () {
        windowFocusHandler.startListening();
        this.props.socket.on("match_start", this.matchStart);
        this.props.socket.on("match_over", this.matchOver);
        this.props.socket.on("game_countdown", this.gameCountdown);
        this.props.socket.on("game_start", this.gameStart);
        this.props.socket.on("game_update", this.gameUpdate);
        this.props.socket.on("game_over", this.gameOver);
        this.props.socket.on("lobby_enter", this.newMatch);
        this.props.socket.on("lobby_update", this.receiveMatchConfig);
    },
    componentWillUnmount: function () {
        this.props.socket.off("match_start", this.matchStart);
        this.props.socket.off("match_over", this.matchOver);
        this.props.socket.off("game_countdown", this.gameCountdown);
        this.props.socket.off("game_start", this.gameStart);
        this.props.socket.off("game_update", this.gameUpdate);
        this.props.socket.off("game_over", this.gameOver);
        this.props.socket.off("lobby_enter", this.newMatch);
        this.props.socket.off("lobby_update", this.receiveMatchConfig);
        windowFocusHandler.stopListening();
    },
    componentDidMount: function () {
        this.refs.name_input.focus();
    },
    newMatch: function ({ playerId, matchConfig }) {
        this.state.playerData.playerId = playerId;
        this.setState({matchConfig});
        this.changeView("new-match");
    },
    receiveMatchConfig: function (matchConfig) {
        this.setState({matchConfig});
    },
    ready: function () {
        this.props.socket.emit("ready");
    },
    matchStart: function () {
        var match = Match({matchConfig: this.state.matchConfig});
        this.setState({match});
    },
    matchOver: function () {
        this.changeView("match-over");
    },
    gameCountdown: function (countdown) {
        this.state.overlay.startGameCountdown(countdown);
    },
    gameStart: function (gameState) {
        this.state.overlay.endGameCountdown();
        this.setState({gameState});
        this.changeView("game");
    },
    gameUpdate: function (data) {
        var thisComponent = this;
        forEach(data.wormPathSegments, function (serverSegments, id) {
            var gameStateSegments = thisComponent.state.gameState.wormPathSegments[id];
            if (!gameStateSegments) {
                gameStateSegments = thisComponent.state.gameState.wormPathSegments[id] = [];
            }
            serverSegments.map(compression.decompressWormSegment).forEach(function (segment) {
                if (segment.index !== undefined) {
                    gameStateSegments[segment.index] = segment;
                }  else {
                    throw Error("No index on wormPathSegment from server");
                }
            })
        });
        data.gameEvents.forEach(event => {
            this.state.gameState.gameEvents.push(event)
        });
        data.powerUpEvents.forEach(event => {
            this.state.gameState.powerUpEvents.push(event)
        });
        data.effectEvents.forEach(event => {
            this.state.gameState.effectEvents.push(event)
        });
        this.state.gameState.gameTime = data.gameTime;
    },
    gameOver: function () {
        this.state.match.addFinishedGameState(this.state.gameState);
        this.changeView("game-over");
    },
    replayRound: function (roundId) {
        this.changeView("replay-round");
        this.setState({replayRoundId: roundId});
    },
    replayLastRound: function () {
        this.replayRound(this.state.match.matchState.roundsData.length - 1);
    },
    onNameChange: function (event) {
        this.state.playerData.name = event.target.value;
        this.forceUpdate();
    },
    enter: function () {
        this.props.socket.emit("enter", {name: this.state.playerData.name});
        this.changeView("waiting");
    },
    leave: function () {
        this.props.socket.emit("leave");
        this.changeView("start");
    }
});

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<Component socket={setupSocket()}/>, mainContainer);
});
