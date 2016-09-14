var ReactDOM = require("react-dom");
var React = require("react");

var Match = require("core/src/core/match.js");

var windowFocusHandler = require("./window-focus-handler.js");
var NewMatchComponent = require("./new-match/new-remote-match-component.js");
var RemoteGameComponent = require("./game/remote-game/remote-game-component.js");
var Header = require("./header/header-component.js");
var ReplayComponent = require("./replay/replay-component.js");
var GameOverComponent = require("./game-over/game-over-component.js");

var io = require("socket.io-client");

function setupSocket() {
    var socket = io("http://achtungonline.com:3000");
    socket.on("connect", function() {
        console.log("Connected to server");
    });
    socket.on("disconnect", function() {
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
    getDefaultProps: function() {
        return {
            initialView: "waiting"
        };
    },
    getInitialState: function () {
        return {
            previousView: this.props.initialView,
            currentView: this.props.initialView,
            playerId: undefined,
            match: null,
            gameState: null,
            replayRoundId: undefined
        };
    },
    render: function () {
        var page;
        if (this.state.currentView === "waiting") {
            page = <div>Waiting for server...</div>;
        } else if (this.state.currentView === "new-match") {
            page =
                <NewMatchComponent
                    onReadyAction={this.ready}
                    playerId={this.state.playerId}
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
                onReplayAction={this.replayLastRound}
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
        this.props.socket.on("start_game", this.startGame);
        this.props.socket.on("player_id", this.setPlayerId);
    },
    componentWillUnmount: function () {
        this.props.socket.off("start_game", this.startGame);
        this.props.socket.off("player_id", this.setPlayerId);
        windowFocusHandler.stopListening();
    },
    newMatch: function () {
        this.changeView("new-match");
    },
    ready: function (matchConfig) {
        var match = Match({ matchConfig });
        this.setState({ match: match });
        this.props.socket.emit("ready");
    },
    setPlayerId: function(playerId) {
        console.log("Setting player id: " + playerId);
        this.setState({ playerId });
        this.changeView("new-match");
    },
    startGame: function(gameState) {
        this.setState({gameState});
        this.changeView("game");
    },
    gameOver: function() {
        this.changeView("game-over");
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
