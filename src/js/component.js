var React = require("react");
var idGenerator = require("core/src/core/util/id-generator.js").indexCounterId(0);

var NewMatchComponent = require("./newMatch/component.js");
var MatchComponent = require("./match/component.js");
var MatchOverComponent = require("./matchOver/component.js");
var CoreMatchFactory = require("core/src/match-factory.js");
var CoreGameStateFunctions = require("core/src/core/game-state-functions.js");
var Header = require("./header/header.js");
var ReplayComponent = require("./match/replayComponent.js");


// Note: The length of this list is also the maximum amount of players. But make sure that there are enough keybindings and names as well
var availableWormColors = [
    {
        id: "blue",
        hexCode: "#03A9F4"
    },
    {
        id: "pink",
        hexCode: "#E91E63"
    },
    {
        id: "green",
        hexCode: "#4CAF50"
    },
    {
        id: "purple",
        hexCode: "#9C27B0"
    },
    {
        id: "orange",
        hexCode: "#FF9800"
    },
    {
        id: "lime",
        hexCode: "#CDDC39"
    },
    {
        id: "indigo",
        hexCode: "#3F51B5"
    },
    {
        id: "teal",
        hexCode: "#009688"
    },

    {
        id: "black",
        hexCode: "#444"
    },
    {
        id: "bluegrey",
        hexCode: "#607D8B"
    },];

var availableNames = [
    "My hat man gandi", "Bill Gates", "Barack Obama", "Pope Francis", "Angela Merkel", "Queen Elizabeth", "Mother Teresa", "Gustav Vasa", "Knugen", "Jesus Christ",
    "Adolf Hitler", "Donald Trump", "Vladimir Putin", "Osama bin Laden", "Kim Jong-un", "Mao Zedong", "Joseph Stalin", "Prophet Muhammad", "Steve Jobs", "Benito Mussolini"];

var availableKeyBindings = [
    {
        left: 65,   //A
        right: 83   //S
    },
    {
        left: 40,   //DOWN
        right: 39   //Right
    },
    {
        left: 89,   //Y
        right: 85   //U
    },
    {
        left: 67,   //C
        right: 86   //V
    },
    {
        left: 90,   //Z
        right: 88   //X
    },
    {
        left: 75,   //K
        right: 76   //L
    },
    {
        left: 66,   //B
        right: 78   //N
    },
    {
        left: 81,   //Q
        right: 87   //W
    },
    {
        left: 72,   //H
        right: 74   //J
    },
    {
        left: 68,   //D
        right: 70   //F
    }
];

var SCORE_INCREASE = 5;

function getUnusedNames(players) {
    var usedNames = players.map(p => p.name);
    return availableNames.filter(n => usedNames.indexOf(n) === -1);
}

function getRandomUnusedName(players) {
    var unusedNames = getUnusedNames(players);
    return unusedNames[Math.floor(Math.random() * unusedNames.length)];
}

function getPlayer(players, playerId) {
    return players.find(function (player) {
        return player.id === playerId;
    });
}

function getUnusedColor(players) {
    var usedColors = players.map(p => p.color.id);
    return availableWormColors.filter(c => usedColors.indexOf(c.id) === -1);
}

function getUnusedKeyBindings(players) {
    var usedLeftKeys = players.map(p => p.left);
    return availableKeyBindings.filter(k => usedLeftKeys.indexOf(k.left) === -1);
}

module.exports = React.createClass({
    displayName: "TopComponent",
    getInitialState: function () {

        var firstName = getRandomUnusedName([]);
        var secondName = getRandomUnusedName([{name: firstName}]);
        return {
            view: this.props.initialView || "newMatch",
            players: [
                {
                    bot: false,
                    color: availableWormColors[0],
                    name: firstName,
                    left: availableKeyBindings[0].left,
                    right: availableKeyBindings[0].right,
                    id: idGenerator()
                },
                {
                    bot: true,
                    color: availableWormColors[1],
                    name: secondName,
                    left: availableKeyBindings[1].left,
                    right: availableKeyBindings[1].right,
                    id: idGenerator()
                }
            ],
            matchConfig: null,
            match: null,
            selectedMap: "Square 500",
            maxScore: 5,
            maxScoreManuallyChanged: false
        };
    },
    render: function () {

        var page;
        //TODO Analyze how to seperate players state etc. from this component
        if (this.state.view === "newMatch") {
            page = <NewMatchComponent players={this.state.players}
                                      selectedMap={this.state.selectedMap}
                                      maxScore={this.state.maxScore}
                                      availableWormColors={availableWormColors}
                                      matchConfig={this.getMatchConfig()}
                                      onStartMatchAction={this.startMatch}
                                      onAddPlayerAction={this.addPlayer}
                                      onNameChangeAction={this.changeName}
                                      onIsBotChangeAction={this.changeIsBot}
                                      onRemovePlayerAction={this.removePlayer}
                                      onPlayerColorChangeAction={this.changePlayerColor}
                                      onMapChangeAction={this.changeMap}
                                      onMaxScoreChangeAction={this.maxScoreChangeAction}
            />;
        } else if (this.state.view === "match") {
            page = <MatchComponent match={this.state.match}
                                   matchConfig={this.state.matchConfig}
                                   players={this.state.players}
                                   onGameOver={this.state.match.addRoundData}
                                   onMatchOverAction={this.endMatch}
            />;

        } else if (this.state.view === "replayRound") {
            var roundData = this.state.match.matchState.roundsData[this.state.replayRoundId];
            page = (
                <div className="m-x-3">
                    <ReplayComponent
                        match={this.state.match}
                        startScore={roundData.startScore}
                        gameState={roundData.gameState}
                        players={this.state.players}
                        maxScore={this.state.match.matchState.maxScore}
                        onReplayGameOver={function() {}}
                        onExitAction={this.endMatch}
                    />
                </div>)

        } else if (this.state.view === "matchOver") {
            page = <MatchOverComponent matchState={this.state.match.matchState}
                                       players={this.state.players}
                                       onRestartAction={this.startMatch}
                                       onExitAction={this.newMatch}
                                       onRoundClick={this.replayRound}

            />;
        } else {
            throw new Error("Unknown view: " + this.state.view);
        }

        return (
            <div className="page-center">
                <Header/>
                {page}
            </div>
        );
    },
    newMatch: function () {
        this.setState({matchConfig: null, match: null, view: "newMatch"});
    },
    getMatchConfig: function () {
        var matchConfig = {};
        matchConfig.playerConfigs = this.state.players.map(function (player) {
            return {
                id: player.id,
                type: player.bot ? "bot" : "human"
            }
        });
        var selectedMap = this.state.selectedMap;

        var selectedMapData = selectedMap.split(" ");
        var mapType = selectedMapData[0];
        var mapWidth = Number(selectedMapData[1]);
        var mapHeight = Number(selectedMapData[2]);
        if (mapType === "Square") {
            matchConfig.map = CoreGameStateFunctions.createMapSquare(selectedMap, mapWidth);
        } else if (mapType === "Rectangle") {
            matchConfig.map = CoreGameStateFunctions.createMapRectangle(selectedMap, mapWidth, mapHeight);
        } else if (mapType === "Circle") {
            matchConfig.map = CoreGameStateFunctions.createMapCircle(selectedMap, mapWidth/2);
        }

        matchConfig.maxScore = this.state.maxScore;
        return matchConfig;
    },
    startMatch: function () {
        var matchConfig = this.getMatchConfig();
        var match = CoreMatchFactory().create({matchConfig: matchConfig});
        this.setState({matchConfig: matchConfig, match: match, view: "match"});
    },
    endMatch: function () {
        this.setState({view: "matchOver"})
    },
    changeMap: function (map) {
        this.setState({selectedMap: map});
    },
    replayRound: function (roundId) {
        this.setState({view: "replayRound", replayRoundId: roundId});
    },
    maxScoreChangeAction: function (maxScore) {
        var parsedMaxScore = maxScore.replace(/[^0-9]/g, "");
        var maxScoreInt = parsedMaxScore === "" ? 0 : parseInt(parsedMaxScore);
        maxScoreInt = Math.min(maxScoreInt, 1000);
        if (maxScoreInt !== this.state.maxScore) {
            this.setState({maxScore: maxScoreInt, maxScoreManuallyChanged: true})
        }
    },
    addPlayer: function () {
        this.setState(function (prevState) {
            var name = getRandomUnusedName(prevState.players);
            var keyBinding = getUnusedKeyBindings(prevState.players)[0];
            return {
                players: prevState.players.concat([{
                    bot: false,
                    color: getUnusedColor(prevState.players)[0],
                    name: name,
                    left: keyBinding.left,
                    right: keyBinding.right,
                    id: idGenerator()
                }]),
                maxScore: prevState.maxScoreManuallyChanged ? prevState.maxScore : prevState.maxScore + SCORE_INCREASE
            };
        });
    },
    changeName: function (playerId, name) {
        this.setState(function (oldState) {
            var player = getPlayer(oldState.players, playerId);
            player.name = name.substring(0, 16);
            return {players: oldState.players};
        });
    },
    changeIsBot: function (playerId, isBot) {
        this.setState(function (oldState) {
            var player = getPlayer(oldState.players, playerId);
            player.bot = isBot;
            return {players: oldState.players};
        });
    },
    removePlayer: function (playerId) {
        var players = this.state.players.filter(function (player) {
            return player.id !== playerId;
        });
        this.setState({players: players, maxScore: this.state.maxScoreManuallyChanged ? this.state.maxScore : this.state.maxScore - SCORE_INCREASE});
    },
    changePlayerColor: function (playerId, color) {
        this.setState(function (oldState) {
            var oldPlayerWithColor = oldState.players.find(function (p) {
                return p.color.id === color.id;
            });

            var newPlayerWithColor = getPlayer(oldState.players, playerId);

            if (oldPlayerWithColor) {
                // The picked color is occupied, so the players need to swap colors.
                oldPlayerWithColor.color = newPlayerWithColor.color;
            }

            newPlayerWithColor.color = color;

            return {
                players: oldState.players
            };
        });
    }
});
