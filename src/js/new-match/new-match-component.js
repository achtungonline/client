import React from "react";

import * as gsf from "core/src/core/game-state-functions.js";
import * as idGeneratorMaker from "core/src/core/util/id-generator.js";
var idGenerator = idGeneratorMaker.indexCounterId(0);
import {wormColorIds} from "core/src/core/constants.js";

import {keyPairs, parseEvent, CONTINUE_KEY, ENTER_KEY, REMOVE_KEY} from "../key-util.js";

import ColorPicker from "./color-picker-component.js";
import KeyPicker from "./key-picker-component.js";
import GamePreview from "./game-preview-component.js";
import * as clientStateFunctions from "../client-state-functions.js";
import * as clientConstants from "./../constants.js"
import GameOverlayComponent from "../canvas/overlays/game-overlay-component.js";


function getNextPlayerId() {
    return "player_" + idGenerator();
}

function getUnusedNames(players) {
    var usedNames = players.map(p => p.name);
    return clientConstants.AVAILABLE_NAMES.filter(n => usedNames.indexOf(n) === -1);
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
        return gsf.createMapSquare({name: mapString, size: mapWidth});
    } else if (mapType === "Rectangle") {
        return gsf.createMapRectangle({name: mapString, width: mapWidth, height: mapHeight});
    } else if (mapType === "Circle") {
        return gsf.createMapCircle({name: mapString, radius: mapWidth / 2});
    } else {
        throw new Error("Invalid map string: " + mapString);
    }
}

export default React.createClass({
    displayName: "NewMatch",
    propType: {
        startMatchConfig: React.PropTypes.object,
        onStartMatchAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
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
            maxScoreManuallyChanged: false,
            selectMapActive: false
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
            var removeButton = this.state.players.length > 2 ? <button className="btn-clean btn-remove-player animation-size-expand-hover animation-size-expand" onMouseDown={this.onRemoveClick.bind(this, player.id)}><img src="svg/cross.svg" alt="X"/></button> : null;

            return (
                <tr key={player.id}>
                    <td className="col-bot">
                        <button className="btn-clean animation-size-expand-hover animation-size-expand" onMouseDown={this.onBotChange.bind(this, player.id)}>
                            <img className="" src={player.type === "human" ? "svg/human.svg" : "svg/computer.svg"} alt="X"/>
                        </button>
                    </td>
                    <td className="col-color">
                        <ColorPicker colorId={player.colorId} availableWormColorIds={wormColorIds} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/>
                    </td>
                    <td className="col-name">
                        <input className="input animation-size-expand" type="text" onChange={this.onNameChange.bind(this, player.id)} value={player.name}/>
                    </td>
                    <KeyPicker currentKey={leftKey} onKeyPicked={onLeftKeyPicked}/>
                    <KeyPicker currentKey={rightKey} onKeyPicked={onRightKeyPicked}/>
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
                        <div className="flex max-score">
                            <img style={{marginTop: "auto"}} src="svg/trophy.svg" alt="Max score: "/>
                            <input style={{marginTop: "auto"}} className="input" type="number" value={this.state.maxScore} onChange={this.onMaxScoreChange}/>
                        </div>
                    </div>
                    <div style={{width: clientConstants.DEFAULT_VISUAL_MAP_SIZES.medium, height: clientConstants.DEFAULT_VISUAL_MAP_SIZES.medium}}>
                        {!this.state.selectMapActive ?
                            <div className="flex animation-size-expand-hover-tiny animation-size-expand new-match-canvas-wrapper" style={{cursor: "pointer"}} onClick={this.onMapSelectClick}>
                                <GamePreview size={clientConstants.DEFAULT_VISUAL_MAP_SIZES.medium} matchConfig={matchConfig}>
                                    <GameOverlayComponent className="canvas-center-text opacity-5 new-match-canvas-overlay">
                                        <h1 className="new-match-preview-content"/>
                                    </GameOverlayComponent>
                                </GamePreview>
                            </div>
                            :
                            <div className="flex" style={{height: "100%", width: "100%", justifyContent: "space-between",alignContent: "space-around"}}>
                                <div className="animation-size-expand-hover-small animation-size-expand new-match-canvas-wrapper" style={{cursor: "pointer"}} onClick={this.onMapChange.bind(this, "Square 500")}>
                                    <GamePreview size="180" centerText="SMALL" matchConfig={this.getMatchConfig({map: createMap("Square 400")})}>
                                        <GameOverlayComponent className="canvas-center-text opacity-5 new-match-canvas-overlay">
                                            <h2>SMALL</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                                <div className="animation-size-expand-hover-small animation-size-expand new-match-canvas-wrapper" style={{cursor: "pointer"}} onClick={this.onMapChange.bind(this, "Square 800")}>
                                    <GamePreview size="180" centerText="LARGE" matchConfig={this.getMatchConfig({map: createMap("Square 700")})}>
                                        <GameOverlayComponent className="canvas-center-text opacity-5 new-match-canvas-overlay">
                                            <h2>LARGE</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                                <div className="animation-size-expand-hover-small animation-size-expand new-match-canvas-wrapper" style={{cursor: "pointer"}} onClick={this.onMapChange.bind(this, "Circle 500")}>
                                    <GamePreview size="180" centerText="SMALL" matchConfig={this.getMatchConfig({map: createMap("Circle 500")})}>
                                        <GameOverlayComponent className="canvas-center-text opacity-5 new-match-canvas-overlay">
                                            <h2>SMALL</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                                <div className="animation-size-expand-hover-small animation-size-expand new-match-canvas-wrapper" style={{cursor: "pointer"}} onClick={this.onMapChange.bind(this, "Circle 800")}>
                                    <GamePreview size="180" centerText="LARGE" matchConfig={this.getMatchConfig({map: createMap("Circle 800")})}>
                                        <GameOverlayComponent className="canvas-center-text opacity-5 new-match-canvas-overlay">
                                            <h2>LARGE</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("keydown", this.onKeyDown);
    },
    componentWillUnmount: function () {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("keydown", this.onKeyDown);
    },
    onKeyDown: function (event) {
        if (clientStateFunctions.isInputElementActive()) {
            return;
        }

        var newKey = parseEvent(event);
        if (newKey === CONTINUE_KEY) {
            this.startMatch();
        } else if (newKey === REMOVE_KEY && this.state.players.length > 2) {
            this.onRemoveClick(this.state.players[this.state.players.length - 1].id);
        } else if (newKey === ENTER_KEY && this.state.players.length < wormColorIds.length) {
            this.addPlayer();
        }
    },
    onMouseUp: function (event) {
        if (event.srcElement.nodeName !== "CANVAS") {
            this.setState({selectMapActive: false});
        }
    },
    getMatchConfig: function ({map} = {}) {
        return {
            players: this.state.players,
            map: map || createMap(this.state.mapString),
            maxScore: this.state.maxScore
        }
    },
    startMatch: function () {
        this.props.onStartMatchAction(this.getMatchConfig());
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
        this.setState({maxScore: newMaxScore, maxScoreManuallyChanged: true})
    },
    onMapSelectClick: function () {
        this.setState({selectMapActive: !this.state.selectMapActive});
    },
    onMapChange: function (value) {
        this.setState({mapString: value, selectMapActive: false});
    },
    onNameChange: function (playerId, event) {
        var name = event.target.value;
        this.setState(function (oldState) {
            var player = oldState.players.find(p => p.id === playerId);
            player.name = name.substring(0, 16);
            return {players: oldState.players};
        });
    },
    onRemoveClick: function (playerId, event) {
        if (event) {
            event.preventDefault();
        }
        var players = this.state.players.filter(function (player) {
            return player.id !== playerId;
        });
        this.setState({players: players, maxScore: this.state.maxScoreManuallyChanged ? this.state.maxScore : this.state.maxScore - clientConstants.SCORE_INCREASE});
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
                maxScore: prevState.maxScoreManuallyChanged ? prevState.maxScore : prevState.maxScore + clientConstants.SCORE_INCREASE
            };
        });
    }
});
