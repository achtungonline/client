import React from "react";

import Match from "core/src/core/match.js";

import * as windowFocusHandler from "./window-focus-handler.js";
import NewMatchComponent from "./new-match/new-match-component.js";
import GameComponent from "./game/local-game/local-game-component.js";
import MatchOverComponent from "./match-over/match-over-component.js";
import Header from "./header/header-component.js";
import ReplayComponent from "./replay/replay-component.js";
import GameOverlay from "./canvas/overlays/game-overlay.js";
import GameOverComponent  from "./game-over/game-over-component.js";
import {parseEvent, isReservedKey} from "./key-util";
import * as clientStateFunctions from "./client-state-functions.js";

export default React.createClass({
    displayName: "TopComponent",
    getDefaultProps: function () {
        return {
            initialView: "new-match"
        };
    },
    getInitialState: function () {
        return {
            previousView: this.props.initialView,
            currentView: this.props.initialView,
            overlay: GameOverlay(),
            match: null,
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
                <GameComponent
                    match={this.state.match}
                    overlay={this.state.overlay}
                    onGameOverAction={this.gameOver}
                />;
        } else if (this.state.currentView === "replay-round") {
            page =
                <ReplayComponent
                    match={this.state.match}
                    roundId={this.state.replayRoundId}
                    overlay={this.state.overlay}
                    onReplayOver={this.changeView.bind(this, this.state.previousView)}
                />
        } else if (this.state.currentView === "game-over") {
            page = <GameOverComponent
                match={this.state.match}
                overlay={this.state.overlay}
                onStartNextGameAction={this.startNextGame}
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
            <div className="page-main">
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
    },
    newMatch: function () {
        this.changeView("new-match");
    },
    componentDidMount: function() {
        document.addEventListener("keydown", this.onKeyDown);
    },
    componentWillUnmount: function () {
        document.removeEventListener("keydown", this.onKeyDown);
    },
    onKeyDown: function(event) {
        // We let inputs behave as they should
        if(clientStateFunctions.isInputElementActive()) {
            return;
        }
        var newKey = parseEvent(event);
        if (isReservedKey(newKey)) {
            event.preventDefault();
        }
    },
    startMatch: function (matchConfig) {
        var match = Match({matchConfig});

        this.setState({match: match});
        this.startNextGame();
    },
    startNextGame: function () {
        this.changeView("game");
    },
    gameOver: function () {
        this.changeView("game-over");
    },
    endMatch: function () {
        this.changeView("match-over");
    },
    replayRound: function (roundId) {
        this.changeView("replay-round");
        this.setState({replayRoundId: roundId});
    },
    replayLastRound: function () {
        this.replayRound(this.state.match.matchState.roundsData.length - 1);
    }
});
