var React = require('react');

var NewMatchComponent = require('./newMatch/component.js');
var MatchComponent = require('./match/component.js');
var MatchOverComponent = require("./matchOver/component.js");
var CoreMatchFactory = require('core/src/match-factory.js');


// Note: The length of this list is also the maximum amount of players. But make sure that there are enough keybindings and names as well
var availableWormColors = [
    {
        id: "black",
        hexCode: "#444"
    },
    {
        id: "yellow",
        hexCode: "#FDD835"
    },
    {
        id: "orange",
        hexCode: "#FF9800"
    },
    {
        id: "red",
        hexCode: "#F44336"
    },
    {
        id: "pink",
        hexCode: "#E91E63"
    },
    {
        id: "purple",
        hexCode: "#9C27B0"
    },
    {
        id: "indigo",
        hexCode: "#3F51B5"
    },
    {
        id: "blue",
        hexCode: "#03A9F4"
    },
    {
        id: "turquoise",
        hexCode: "#009688"
    },
    {
        id: "green",
        hexCode: "#8BC34A"
    }];

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
            nextId: 2,
            players: [
                {
                    bot: false,
                    color: availableWormColors[0],
                    name: firstName,
                    left: availableKeyBindings[0].left,
                    right: availableKeyBindings[0].right,
                    id: 0
                },
                {
                    bot: true,
                    color: availableWormColors[1],
                    name: secondName,
                    left: availableKeyBindings[1].left,
                    right: availableKeyBindings[1].right,
                    id: 1
                }
            ],
            matchConfig: null,
            match: null
        };
    },
    render: function () {
        //TODO Analyze how to seperate players state etc. from this component
        if (this.state.view === "newMatch") {
            return <NewMatchComponent players={this.state.players}
                                      availableWormColors={availableWormColors}
                                      onStartMatchAction={this.startMatch}
                                      onAddPlayerAction={this.addPlayer}
                                      onNameChangeAction={this.changeName}
                                      onIsBotChangeAction={this.changeIsBot}
                                      onRemovePlayerAction={this.removePlayer}
                                      onPlayerColorChangeAction={this.changePlayerColor}
            />;
        } else if (this.state.view === "match") {
            return <MatchComponent match={this.state.match}
                                   matchConfig={this.state.matchConfig}
                                   players={this.state.players}
                                   onMatchOverAction={this.endMatch}
            />;
        } else if (this.state.view === "matchOver") {
            return <MatchOverComponent matchState={this.state.match.matchState}
                                       players={this.state.players}
                                       onRestartAction={this.startMatch}
                                       onExitAction={this.newMatch}
            />;
        } else {
            throw new Error("Unknown view: " + this.state.view);
        }
    },
    newMatch: function () {
        this.setState({matchConfig: null, match: null, view: "newMatch"});
    },
    startMatch: function () {
        var matchConfig = {};
        matchConfig.playerConfigs = this.state.players.map(function (player) {
            return {
                id: player.id,
                type: player.bot ? "bot" : "human"
            }
        });
        matchConfig.maxScore = 15;
        var match = CoreMatchFactory().create({matchConfig: matchConfig});
        this.setState({matchConfig: matchConfig, match: match, view: "match"});
    },
    endMatch: function () {
        this.setState({view: "matchOver"})
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
                    id: prevState.nextId
                }]),
                nextId: prevState.nextId + 1
            };
        });
    },
    changeName: function (playerId, name) {
        this.setState(function (oldState) {
            var player = getPlayer(oldState.players, playerId);
            player.name = name.substring(0, 20);
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
        this.setState({players: players});
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
