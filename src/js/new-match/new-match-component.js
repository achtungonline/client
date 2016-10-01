var React = require("react");

var gameStateFunctions = require("core/src/core/game-state-functions.js");
var idGenerator = require("core/src/core/util/id-generator.js").indexCounterId(0);
var wormColorIds = require("core/src/core/constants.js").wormColorIds;

import {keyPairs, parseEvent, CONTINUE_KEY, ENTER_KEY, REMOVE_KEY} from "../key-util.js";

var ColorPicker = require("./color-picker-component.js");
var KeyPicker = require("./key-picker-component.js");
var GamePreview = require("./game-preview-component.js");

var availableNames = [
    "My hat man gandi", "Bill Gates", "Barack Obama", "Pope Francis", "Angela Merkel", "Queen Elizabeth", "Mother Teresa", "Gustav Vasa", "Knugen", "Jesus Christ",
    "Adolf Hitler", "Donald Trump", "Vladimir Putin", "Osama bin Laden", "Kim Jong-un", "Mao Zedong", "Joseph Stalin", "Prophet Muhammad", "Steve Jobs", "Benito Mussolini"];

var playerTypeSvg = {
    "human": "svg/human.svg",
    "bot": "svg/computer.svg"
};

var SCORE_INCREASE = 5;

function getNextPlayerId() {
    return "player_" + idGenerator();
}

function getUnusedNames(players) {
    var usedNames = players.map(p => p.name);
    return availableNames.filter(n => usedNames.indexOf(n) === -1);
}

function getRandomUnusedName(players) {
    var unusedNames = getUnusedNames(players);
    return unusedNames[Math.floor(Math.random() * unusedNames.length)];
}

function getUnusedKeyBindings(players) {
    return keyPairs.filter(b => players.every(p => p.left !== b.left && p.right !== b.left && p.left !== b.right && p.right !== b.right));
}

function createMap(mapString) {
    var mapData = mapString.split(" ");
    var mapType = mapData[0];
    var mapWidth = Number(mapData[1]);
    var mapHeight = Number(mapData[2]);
    if (mapType === "Square") {
        return gameStateFunctions.createMapSquare({ name: mapString, size: mapWidth });
    } else if (mapType === "Rectangle") {
        return gameStateFunctions.createMapRectangle({ name: mapString, width: mapWidth, height: mapHeight });
    } else if (mapType === "Circle") {
        return gameStateFunctions.createMapCircle({ name: mapString, radius: mapWidth/2 });
    } else {
        throw new Error("Invalid map string: " + mapString);
    }
}

module.exports = React.createClass({
    displayName: "NewMatch",
    propType: {
        startMatchConfig: React.PropTypes.object,
        onStartMatchAction: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        var firstName = getRandomUnusedName([]);
        var secondName = getRandomUnusedName([{name: firstName}]);
        return {
            players: this.props.startMatchConfig ? this.props.startMatchConfig.players : [
                {
                    type: "human",
                    colorId: wormColorIds[0],
                    name: firstName,
                    left: keyPairs[0].left,
                    right: keyPairs[0].right,
                    id: getNextPlayerId()
                },
                {
                    type: "bot",
                    colorId: wormColorIds[1],
                    name: secondName,
                    left: keyPairs[1].left,
                    right: keyPairs[1].right,
                    id: getNextPlayerId()
                }
            ],
            maxScore: this.props.startMatchConfig ? this.props.startMatchConfig.maxScore : 5,
            mapString: this.props.startMatchConfig ? this.props.startMatchConfig.map.name : "Square 500",
            maxScoreManuallyChanged: false
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
            var removeButton = this.state.players.length > 2 ? <button className="btn-clean btn-remove-player" onMouseDown={this.onRemoveClick.bind(this, player.id)}><img src="svg/cross.svg" alt="X"/></button> : null;

            return (
                <tr key={player.id}>
                    <td className="col-bot">
                        <button className="btn-clean" onMouseDown={this.onBotChange.bind(this, player.id)}>
                            <img src={playerTypeSvg[player.type]} alt="X"/>
                        </button>
                    </td>
                    <td className="col-color">
                        <ColorPicker colorId={player.colorId} availableWormColorIds={wormColorIds} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/>
                    </td>
                    <td className="col-name">
                        <input className="input" type="text" onChange={this.onNameChange.bind(this, player.id)} value={player.name}/>
                    </td>
                    <KeyPicker currentKey={leftKey} onKeyPicked={onLeftKeyPicked} />
                    <KeyPicker currentKey={rightKey}  onKeyPicked={onRightKeyPicked} />
                    <td className="col-remove">
                        {removeButton}
                    </td>
                </tr>
            );
        }, this);

        var maxPlayersReached = this.state.players.length >= wormColorIds.length;

        return (
            <div className="flex flex-center new-match">
                <div>
                    <table className="table table-player" cellSpacing="0" cellPadding="0">
                        <tbody>
                        {rows}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="5">
                            {maxPlayersReached ? null : <button className="btn btn-secondary btn-add-player" onClick={this.addPlayer}>Add player</button>}
                                <button className="btn btn-primary" onClick={this.startMatch}>Start</button>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="game-settings">
                    <div className="flex flex-space-between">
                        <div className="select select-primary side" style={{marginTop: "auto"}}>
                            <select value={this.state.mapString} onChange={this.onMapChange}>
                                <option value="Square 500">Small Square</option>
                                <option value="Circle 500">Small Circle</option>
                                <option value="Square 800">Large Square</option>
                                <option value="Circle 800">Large Circle</option>
                            </select>
                        </div>
                        <div className="flex max-score">
                            <img style={{marginTop: "auto"}} src="svg/trophy.svg" alt="Max score: "/>
                            <input style={{marginTop: "auto"}} className="input" type="number" value={this.state.maxScore} onChange={this.onMaxScoreChange}/>
                        </div>
                    </div>
                    <div className="game-area-medium">
                        <GamePreview matchConfig={matchConfig} />
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount: function() {
        document.addEventListener("keydown", this.onKeyDown);
    },
    componentWillUnmount: function () {
        document.removeEventListener("keydown", this.onKeyDown);
    },
    onKeyDown: function(event) {
        var newKey = parseEvent(event);
        if (newKey === CONTINUE_KEY && this.state.players.length < wormColorIds.length) {
            this.addPlayer();
        } else if (newKey === REMOVE_KEY && this.state.players.length > 2) {
            this.onRemoveClick(this.state.players[this.state.players.length - 1].id);
        } else if (newKey === ENTER_KEY) {
            this.startMatch();
        }
    },
    startMatch: function() {
        var matchConfig = {
            players: this.state.players,
            map: createMap(this.state.mapString),
            maxScore: this.state.maxScore
        };
        this.props.onStartMatchAction(matchConfig);
    },
    onBotChange: function (playerId, event) {
        event.preventDefault();
        this.setState(function (oldState) {
            var player = oldState.players.find(p => p.id === playerId);
            if (player.type === "bot") {
                player.type = "human";
            } else {
                player.type = "bot";
            }
            return {players: oldState.players};
        });
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
    onMaxScoreChange: function (event) {
        var parsedMaxScore = event.target.value.replace(/[^0-9]/g, "");
        var newMaxScore = parsedMaxScore === "" ? 0 : parseInt(parsedMaxScore);
        newMaxScore = Math.min(newMaxScore, 1000);
        this.setState({ maxScore: newMaxScore, maxScoreManuallyChanged: true })
    },
    onMapChange: function (event) {
        this.setState({ mapString: event.target.value });
    },
    onNameChange: function (playerId, event) {
        var name = event.target.value;
        this.setState(function (oldState) {
            var player = oldState.players.find(p => p.id === playerId);
            player.name = name.substring(0, 16);
            return { players: oldState.players };
        });
    },
    onRemoveClick: function (playerId, event) {
        if (event) {
            event.preventDefault();
        }
        var players = this.state.players.filter(function (player) {
            return player.id !== playerId;
        });
        this.setState({players: players, maxScore: this.state.maxScoreManuallyChanged ? this.state.maxScore : this.state.maxScore - SCORE_INCREASE});
    },
    onPlayerColorChange: function (playerId, newColorId) {
        this.setState(function (oldState) {
            var oldPlayerWithColor = oldState.players.find(p => p.colorId === newColorId);
            var newPlayerWithColor = oldState.players.find(p => p.id === playerId);

            if (oldPlayerWithColor) {
                // The picked color is occupied, so the players need to swap colors.
                oldPlayerWithColor.colorId = newPlayerWithColor.colorId;
            }

            newPlayerWithColor.colorId = newColorId;

            return {
                players: oldState.players
            };
        });
    },
    addPlayer: function () {
        this.setState(function (prevState) {
            var name = getRandomUnusedName(prevState.players);
            var keyBinding = getUnusedKeyBindings(prevState.players)[0] || {left: null, right: null};
            return {
                players: prevState.players.concat([{
                    type: "human",
                    colorId: wormColorIds.find(id => prevState.players.every(p => p.colorId !== id)),
                    name: name,
                    left: keyBinding.left,
                    right: keyBinding.right,
                    id: getNextPlayerId()
                }]),
                maxScore: prevState.maxScoreManuallyChanged ? prevState.maxScore : prevState.maxScore + SCORE_INCREASE
            };
        });
    }
});
