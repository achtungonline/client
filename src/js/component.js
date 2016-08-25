var React = require("react");

var MatchFactory = require("core/src/match-factory.js");

var windowFocusHandler = require("./window-focus-handler.js");
var NewMatchComponent = require("./new-match/new-match-component.js");
var GameComponent = require("./game/game-component.js");
var MatchOverComponent = require("./match-over/match-over-component.js");
var Header = require("./header/header-component.js");
var ReplayComponent = require("./replay/replay-component.js");
var GameOverComponent = require("./game-over/game-over-component.js");

module.exports = React.createClass({
    displayName: "TopComponent",
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
                    onGameOverAction={this.gameOver}
                    onMatchOverAction={this.endMatch}
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
    },
    componentWillUnmount: function () {
        windowFocusHandler.stopListening();
    },
    newMatch: function () {
        this.changeView("new-match");
    },
    startMatch: function (matchConfig) {
        var match = MatchFactory().create({ matchConfig });
        this.setState({ match: match });
        this.startNextGame();
    },
    startNextGame: function() {
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
