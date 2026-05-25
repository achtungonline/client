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

var MOBILE_MAX_HUMANS = 2;


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
        var mobile = clientStateFunctions.isMobile();
        var defaultMap = mobile ? "Square 400" : "Square 500";
        return {
            mobile: mobile,
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
                    type: mobile ? "human" : "bot",
                    colorId: wormColorIds[1],
                    name: secondName,
                    left: keyPairs[1].left,
                    right: keyPairs[1].right,
                    id: getNextPlayerId()
                }
            ],
            maxScore: this.props.startMatchConfig ? this.props.startMatchConfig.maxScore : clientConstants.SCORE_INCREASE,
            mapString: this.props.startMatchConfig ? this.props.startMatchConfig.map.name : defaultMap,
            selectMapActive: false
        };
    },
    render: function () {
        var matchConfig = {
            players: this.state.players,
            map: createMap(this.state.mapString),
            maxScore: this.state.maxScore
        };

        if (this.state.mobile) {
            return this.renderMobile(matchConfig);
        }

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
                    {player.type === "human" ? [
                        <KeyPicker key="left" currentKey={leftKey} onKeyPicked={(key) => {
                            onLeftKeyPicked(key);
                            setTimeout(this["keyPickerRightRef" + player.id].onClick, 0)
                        }}/>,
                        <KeyPicker key="right" ref={(ref) => {
                            this["keyPickerRightRef" + player.id] = ref
                        }} currentKey={rightKey} onKeyPicked={onRightKeyPicked}/>
                    ] : [
                        <td key="left" className="col-keybinding"/>,
                        <td key="right" className="col-keybinding"/>]
                    }
                    <td className="col-remove">
                        {removeButton}
                    </td>
                </tr>
            );
        }, this);

        var maxPlayersReached = this.state.players.length >= wormColorIds.length;

        return (
            <div className="flex new-match">
                <div style={{flexBasis: "50%"}}>
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
                <div style={{flexBasis: "50%", marginTop: "6px"}}>
                    <div className="flex flex-space-between">
                        <div className="flex max-score">
                            <img style={{marginTop: "auto"}} src="svg/trophy.svg" alt="Max score: "/>
                            <input style={{marginTop: "auto"}} className="input" type="number" value={this.state.maxScore} onChange={this.onMaxScoreChange}/>
                        </div>
                    </div>
                    <div style={{minWidth: "510px"}} className="new-match-preview">
                        {!this.state.selectMapActive ?
                            <div className="flex canvas-overlay-hover-wrapper preview-canvas-container" style={{cursor: "pointer"}} onClick={this.onMapSelectClick}>
                                <GamePreview matchConfig={matchConfig}>
                                    <GameOverlayComponent className="canvas-overlay-text map-canvas-z-index opacity-5 canvas-overlay-hover-effect">
                                        <h1 style={{fontSize: "40px"}}>CHANGE MAP</h1>
                                    </GameOverlayComponent>
                                </GamePreview>
                            </div>
                            :
                            <div className="flex preview-canvas-container" style={{height: "100%", width: "100%", justifyContent: "space-around", alignContent: "space-around"}}>
                                <div className="animation-size-expand-hover-small animation-size-expand canvas-overlay-hover-wrapper" style={{cursor: "pointer", width: "40%", height: "40%"}} onClick={this.onMapChange.bind(this, "Square 500")}>
                                    <GamePreview centerText="SMALL" matchConfig={this.getMatchConfig({map: createMap("Square 400")})}>
                                        <GameOverlayComponent className="canvas-overlay-text map-canvas-z-index opacity-5 canvas-overlay-hover-effect">
                                            <h2>SMALL</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                                <div className="animation-size-expand-hover-small animation-size-expand canvas-overlay-hover-wrapper" style={{cursor: "pointer", width: "40%", height: "40%"}} onClick={this.onMapChange.bind(this, "Square 800")}>
                                    <GamePreview centerText="LARGE" matchConfig={this.getMatchConfig({map: createMap("Square 700")})}>
                                        <GameOverlayComponent className="canvas-overlay-text map-canvas-z-index opacity-5 canvas-overlay-hover-effect">
                                            <h2>LARGE</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                                <div className="animation-size-expand-hover-small animation-size-expand canvas-overlay-hover-wrapper" style={{cursor: "pointer", width: "40%", height: "40%"}} onClick={this.onMapChange.bind(this, "Circle 500")}>
                                    <GamePreview centerText="SMALL" matchConfig={this.getMatchConfig({map: createMap("Circle 500")})}>
                                        <GameOverlayComponent className="canvas-overlay-text map-canvas-z-index opacity-5 canvas-overlay-hover-effect">
                                            <h2>SMALL</h2>
                                        </GameOverlayComponent>
                                    </GamePreview>
                                </div>
                                <div className="animation-size-expand-hover-small animation-size-expand canvas-overlay-hover-wrapper" style={{cursor: "pointer", width: "40%", height: "40%"}} onClick={this.onMapChange.bind(this, "Circle 800")}>
                                    <GamePreview centerText="LARGE" matchConfig={this.getMatchConfig({map: createMap("Circle 800")})}>
                                        <GameOverlayComponent className="canvas-overlay-text map-canvas-z-index opacity-5 canvas-overlay-hover-effect">
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
    renderMobile: function (matchConfig) {
        var thisComponent = this;
        var humanCount = this.state.players.filter(function (p) { return p.type === "human"; }).length;
        var mapOptions = [
            {label: "Small square", value: "Square 400"},
            {label: "Big square", value: "Square 700"},
            {label: "Small circle", value: "Circle 500"},
            {label: "Big circle", value: "Circle 800"}
        ];

        var playerCards = this.state.players.map(function (player) {
            var disableBotToggle = player.type === "bot" && humanCount >= MOBILE_MAX_HUMANS;
            var removeButton = thisComponent.state.players.length > 2 ?
                <button className="btn-clean player-card-remove animation-size-expand-hover" onMouseDown={thisComponent.onRemoveClick.bind(thisComponent, player.id)}>
                    <img src="svg/cross.svg" alt="Remove" style={{width: 24, height: 24}}/>
                </button> : null;
            return (
                <div key={player.id} className="player-card-mobile">
                    <button className="btn-clean player-card-type-btn animation-size-expand-hover"
                            onClick={disableBotToggle ? null : thisComponent.onBotChange.bind(thisComponent, player.id)}
                            style={disableBotToggle ? {opacity: 0.4} : {}}
                            title={disableBotToggle ? "Maximum 2 humans on mobile" : (player.type === "human" ? "Switch to bot" : "Switch to human")}
                    >
                        <img src={player.type === "human" ? "svg/human.svg" : "svg/computer.svg"} alt={player.type}/>
                    </button>
                    <div className="player-card-color">
                        <ColorPicker colorId={player.colorId} availableWormColorIds={wormColorIds} onColorSelected={thisComponent.onPlayerColorChange.bind(thisComponent, player.id)}/>
                    </div>
                    <div className="player-card-name">
                        <input className="input" type="text" onChange={thisComponent.onNameChange.bind(thisComponent, player.id)} value={player.name}/>
                    </div>
                    {removeButton}
                </div>
            );
        });

        var maxPlayersReached = this.state.players.length >= wormColorIds.length;

        return (
            <div className="new-match-mobile">
                <div className="new-match-mobile-controls-hint">
                    Up to 2 humans + bots. Players sit on opposite sides of the phone —
                    P1 taps the bottom half (left/right), P2 taps the top half (mirrored).
                </div>

                {playerCards}

                <div className="new-match-mobile-actions">
                    {!maxPlayersReached ?
                        <button className="btn btn-secondary" onClick={this.addPlayer}>Add player</button> : null}
                    <button className="btn btn-primary" onClick={this.startMatch}>Start</button>
                </div>

                <div className="flex max-score" style={{margin: "0 auto"}}>
                    <img style={{marginTop: "auto"}} src="svg/trophy.svg" alt="Max score: "/>
                    <input style={{marginTop: "auto"}} className="input" type="number" value={this.state.maxScore} onChange={this.onMaxScoreChange}/>
                </div>

                <div className="new-match-mobile-map">
                    {mapOptions.map(function (opt) {
                        var selected = thisComponent.state.mapString === opt.value;
                        return (
                            <div key={opt.value}
                                 className={"map-choice" + (selected ? " selected" : "")}
                                 onClick={thisComponent.onMapChange.bind(thisComponent, opt.value)}>
                                <GamePreview matchConfig={thisComponent.getMatchConfig({map: createMap(opt.value)})}>
                                    <GameOverlayComponent className="canvas-overlay-text map-canvas-z-index opacity-5">
                                        <h3 style={{fontSize: "14px"}}>{opt.label}</h3>
                                    </GameOverlayComponent>
                                </GamePreview>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("resize", this.onWindowResize);
    },
    componentWillUnmount: function () {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("resize", this.onWindowResize);
    },
    onWindowResize: function () {
        var nowMobile = clientStateFunctions.isMobile();
        if (nowMobile !== this.state.mobile) {
            this.setState({mobile: nowMobile});
        }
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
        if (event) {
            event.preventDefault();
        }
        var mobile = this.state.mobile;
        this.setState(function (oldState) {
            var player = oldState.players.find(p => p.id === playerId);
            if (player.type === "bot") {
                var humanCount = oldState.players.filter(p => p.type === "human").length;
                if (mobile && humanCount >= MOBILE_MAX_HUMANS) {
                    return {};
                }
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
        var newMaxScore = event.target.value === "" ? 0 : parseInt(event.target.value);
        newMaxScore = Math.max(1, newMaxScore);
        this.setState({maxScore: newMaxScore})
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
        this.setState({players: players, maxScore: (players.length - 1) * clientConstants.SCORE_INCREASE});
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
        var mobile = this.state.mobile;
        this.setState(function (prevState) {
            var name = getRandomUnusedName(prevState.players);
            var keyBinding = getUnusedKeyBindings(prevState.players)[0] || {left: null, right: null};
            var humanCount = prevState.players.filter(p => p.type === "human").length;
            var newPlayerType = (mobile && humanCount >= MOBILE_MAX_HUMANS) ? "bot" : "human";
            var newPlayers = prevState.players.concat([{
                type: newPlayerType,
                colorId: wormColorIds.find(id => prevState.players.every(p => p.colorId !== id)),
                name: name,
                left: keyBinding.left,
                right: keyBinding.right,
                id: getNextPlayerId()
            }]);
            return {
                players: newPlayers,
                maxScore: (newPlayers.length - 1) * clientConstants.SCORE_INCREASE
            };
        });
    }
});
