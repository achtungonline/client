import ReactDOM from "react-dom";
import React from "react";

import Match from "core/src/core/match";

import * as windowFocusHandler from "./window-focus-handler.js";
import NewMatchComponent from "./new-match/new-match-component.js";
import RemoteGameComponent from "./game/remote-game/remote-game-component.js";
import MatchOverComponent from "./match-over/match-over-component.js";
import Header from "./header/header-component.js";
import ReplayComponent from "./replay/replay-component.js";
import GameOverComponent from "./game-over/game-over-component.js";

import * as io from "socket.io-client";

function setupSocket() {
    var socket = io("http://localhost:3000");
    socket.on("connect", function() {
        console.log("Connected to server");
    });
    socket.on("disconnect", function() {
        console.log("Disconnected from server");
    });
    return socket;
}

var Component = React.createClass({
    displayName: "ServerTestComponent",
    propTypes: {
        socket: React.PropTypes.object.isRequired,
        initialView: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            initialView: "new-match"
        };
    },
    getInitialState: function () {
        return {
            previousView: this.props.initialView,
            currentView: this.props.initialView,
            match: null,
            gameState: null,
            replayRoundId: undefined
        };
    },
    render: function () {
        var page;
        if (this.state.currentView === "new-match") {
            page =
                <NewMatchComponent
                    startMatchConfig={this.state.match ? this.state.match.matchConfig : undefined}
                    onStartMatchAction={this.startMatch}
                />;
        } else if (this.state.currentView === "game") {
            page =
                <RemoteGameComponent
                    match={this.state.match}
                    gameState={this.state.gameState}
                    socket={this.props.socket}
                    onGameOverAction={this.gameOver}
                />;
        } else if (this.state.currentView === "replay-round") {
            page =
                <div className="m-x-3">
                    <ReplayComponent
                        match={this.state.match}
                        roundId={this.state.replayRoundId}
                        onReplayOver={this.changeView.bind(this, this.state.previousView)}
                    />
                </div>;
        } else if (this.state.currentView === "game-over") {
            page = <GameOverComponent
                match={this.state.match}
                onStartNextGameAction={this.requestStartGame}
                onReplayAction={this.replayLastRound}
                onMatchOverAction={this.endMatch}
            />;
        } else if (this.state.currentView === "match-over") {
            page = <MatchOverComponent
                match={this.state.match}
                onRestartAction={this.startMatch.bind(this, this.state.match.matchConfig)}
                onRoundClick={this.replayRound}
                onExitAction={this.newMatch}
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
    changeView: function(view) {
        this.setState({ previousView: this.state.currentView, currentView: view })
    },
    componentWillMount: function () {
        windowFocusHandler.startListening();
        this.props.socket.on("start_game", this.gameStart);
    },
    componentWillUnmount: function () {
        this.props.socket.off("start_game", this.gameStart);
        windowFocusHandler.stopListening();
    },
    newMatch: function () {
        this.changeView("new-match");
    },
    startMatch: function (matchConfig) {
        var match = Match({ matchConfig });
        this.setState({ match: match });
        this.props.socket.emit("match_config", matchConfig);
        this.requestStartGame();
    },
    requestStartGame: function() {
        this.props.socket.emit("start_game");
    },
    gameStart: function(gameState) {
        this.setState({gameState});
        this.changeView("game");
    },
    gameOver: function() {
        this.changeView("game-over");
    },
    endMatch: function () {
        this.changeView("match-over");
    },
    replayRound: function (roundId) {
        this.changeView("replay-round");
        this.setState({ replayRoundId: roundId });
    },
    replayLastRound: function () {
        this.replayRound(this.state.match.matchState.roundsData.length - 1);
    }
});

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<Component socket={setupSocket()}/>, mainContainer);
});
