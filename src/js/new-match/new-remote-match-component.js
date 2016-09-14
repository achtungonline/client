var React = require("react");

var gameStateFunctions = require("core/src/core/game-state-functions.js");

var availableKeyBindings = require("../key-util.js").keyPairs;

var ColorPicker = require("./color-picker-component.js");
var KeyPicker = require("./key-picker-component.js");
var GamePreview = require("./game-preview-component.js");

// Note: The length of this list is also the maximum amount of players. But make sure that there are enough keybindings and keyCodeMapping as well
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
    }
];

var availableNames = [
    "My hat man gandi", "Bill Gates", "Barack Obama", "Pope Francis", "Angela Merkel", "Queen Elizabeth", "Mother Teresa", "Gustav Vasa", "Knugen", "Jesus Christ",
    "Adolf Hitler", "Donald Trump", "Vladimir Putin", "Osama bin Laden", "Kim Jong-un", "Mao Zedong", "Joseph Stalin", "Prophet Muhammad", "Steve Jobs", "Benito Mussolini"];

var playerTypeSvg = {
    "human": "svg/human.svg",
    "bot": "svg/computer.svg"
};

function getUnusedNames(players) {
    var usedNames = players.map(p => p.name);
    return availableNames.filter(n => usedNames.indexOf(n) === -1);
}

function getRandomUnusedName(players) {
    var unusedNames = getUnusedNames(players);
    return unusedNames[Math.floor(Math.random() * unusedNames.length)];
}

function createMap(mapString) {
    var mapData = mapString.split(" ");
    var mapType = mapData[0];
    var mapWidth = Number(mapData[1]);
    var mapHeight = Number(mapData[2]);
    if (mapType === "Square") {
        return gameStateFunctions.createMapSquare(mapString, mapWidth);
    } else if (mapType === "Rectangle") {
        return gameStateFunctions.createMapRectangle(mapString, mapWidth, mapHeight);
    } else if (mapType === "Circle") {
        return gameStateFunctions.createMapCircle(mapString, mapWidth/2);
    } else {
        throw new Error("Invalid map string: " + mapString);
    }
}

module.exports = React.createClass({
    displayName: "NewMatch",
    propType: {
        onReadyAction: React.PropTypes.func.isRequired,
        playerId: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        var firstName = getRandomUnusedName([]);
        var secondName = getRandomUnusedName([{name: firstName}]);
        var players = [];
        for (var i = 0; i < 2; i++) {
            var player = {
                type: "bot",
                color: availableWormColors[i],
                name: [firstName, secondName][i],
                left: null,
                right: null,
                id: i + ""
            };
            if (player.id === this.props.playerId) {
                player.type = "human";
                player.left = availableKeyBindings[0].left;
                player.right = availableKeyBindings[0].right;
            }
            players.push(player);
        }
        return {
            players,
            maxScore: 5,
            mapString: "Square 500",
            ready: false
        };
    },
    render: function () {
        var matchConfig = {
            players: this.state.players,
            map: createMap(this.state.mapString),
            maxScore: this.state.maxScore
        };

        var rows = this.state.players.map(function (player) {
            var leftKey, onLeftKeyPicked, rightKey, onRightKeyPicked;
            if (player.type === "human") {
                leftKey = player.left;
                onLeftKeyPicked = this.onKeyChange.bind(this, player.id, "left");
                rightKey = player.right;
                onRightKeyPicked = this.onKeyChange.bind(this, player.id, "right");
            }

            return (
                <tr key={player.id}>
                    <td className="col-bot">
                        <button className="btn-clean">
                            <img src={playerTypeSvg[player.type]} alt="X"/>
                        </button>
                    </td>
                    <td className="col-color">
                        <ColorPicker color={player.color} availableWormColors={availableWormColors} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/>
                    </td>
                    <td className="col-name">
                        <input className="input" type="text" onChange={this.onNameChange.bind(this, player.id)} value={player.name}/>
                    </td>
                    <KeyPicker currentKey={leftKey} onKeyPicked={onLeftKeyPicked} />
                    <KeyPicker currentKey={rightKey}  onKeyPicked={onRightKeyPicked} />
                </tr>
            );
        }, this);

        var readyButton = this.state.ready ? null : <button className="btn btn-primary" onClick={this.ready.bind(this, matchConfig)}>Ready</button>;

        return (
            <div className="flex flex-space-between new-match">
                <div style={{width: 543}}>
                    <table className="table table-player" cellSpacing="0" cellPadding="0">
                        <tbody>
                        {rows}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="5">
                                {readyButton}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="game-settings">
                    <div>
                        <GamePreview matchConfig={matchConfig} />
                    </div>
                </div>
            </div>
        );
    },
    ready: function(matchConfig) {
        this.props.onReadyAction(matchConfig);
        this.setState({ ready: true });
    },
    onKeyChange: function (playerId, target, newKey) {
        this.setState(function (oldState) {
            oldState.players.forEach(function (player) {
                if (player.left === newKey) {
                    player.left = null;
                }
                if (player.right === newKey) {
                    player.right = null;
                }
            });
            oldState.players.find(p => p.id === playerId)[target] = newKey;
            return {players: oldState.players};
        });
    },
    onNameChange: function (playerId, event) {
        var name = event.target.value;
        this.setState(function (oldState) {
            var player = oldState.players.find(p => p.id === playerId);
            player.name = name.substring(0, 16);
            return { players: oldState.players };
        });
    },
    onPlayerColorChange: function (playerId, color) {
        this.setState(function (oldState) {
            var oldPlayerWithColor = oldState.players.find(p => p.color.id === color.id);
            var newPlayerWithColor = oldState.players.find(p => p.id === playerId);

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
