var ReactDOM = require("react-dom");
var React = require("react");

var Match = require("core/src/core/match.js");

var availableKeyBindings = require("./key-util.js").keyPairs;
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
            initialView: "enter"
        };
    },
    getInitialState: function () {
        return {
            previousView: this.props.initialView,
            currentView: this.props.initialView,
            playerData: {
                name: "John Doe",
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
        if (this.state.currentView === "enter") {
            page =
                <div style={{width: "30%", margin: "auto"}}>
                    <input className="input" type="text" onChange={this.onNameChange} value={this.state.playerData.name}/>
                    <button className="btn btn-primary" onClick={this.enter}>Enter</button>
                </div>;
        } else if (this.state.currentView === "waiting") {
            page = <div style={{width: "30%", margin: "auto"}}>Waiting for server...</div>;
        } else if (this.state.currentView === "new-match") {
            page =
                <NewMatchComponent
                    matchConfig={this.state.matchConfig}
                    playerData={this.state.playerData}
                    onReadyAction={this.ready}
                    onColorChange={newColorId => this.props.socket.emit("color_change", newColorId)}
                />;
        } else if (this.state.currentView === "game") {
            page =
                <RemoteGameComponent
                    match={this.state.match}
                    playerData={this.state.playerData}
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
        this.props.socket.on("game_start", this.startGame);
        this.props.socket.on("lobby_enter", this.newMatch);
        this.props.socket.on("lobby_update", this.receiveMatchConfig);
    },
    componentWillUnmount: function () {
        this.props.socket.off("game_start", this.startGame);
        this.props.socket.off("lobby_enter", this.newMatch);
        this.props.socket.off("lobby_update", this.receiveMatchConfig);
        windowFocusHandler.stopListening();
    },
    newMatch: function ({ playerId, matchConfig }) {
        this.state.playerData.playerId = playerId;
        this.setState({matchConfig});
        this.changeView("new-match");
    },
    receiveMatchConfig: function(matchConfig) {
        this.setState({matchConfig});
    },
    ready: function () {
        this.props.socket.emit("ready");
    },
    startGame: function(gameState) {
        var match = Match({ matchConfig: this.state.matchConfig });
        this.setState({ match, gameState });
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
    },
    onNameChange: function(event) {
        this.state.playerData.name = event.target.value;
        this.forceUpdate();
    },
    enter: function() {
        this.props.socket.emit("enter", this.state.playerData);
        this.changeView("waiting");
    }
});

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<Component socket={setupSocket()}/>, mainContainer);
});
