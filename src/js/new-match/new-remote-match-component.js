import React from "react";

import {wormColorIds} from "core/src/core/constants.js";

import ColorPicker from "./color-picker-component.js";
import KeyPicker from "./key-picker-component.js";
import GamePreview from "./game-preview-component.js";

export default React.createClass({
    displayName: "NewMatch",
    propType: {
        matchConfig: React.PropTypes.object.isRequired,
        lobbyData: React.PropTypes.object.isRequired,
        playerData: React.PropTypes.object.isRequired,
        onReadyAction: React.PropTypes.func.isRequired,
        onColorChange: React.PropTypes.func,
        onLeaveAction: React.PropTypes.func
    },
    render: function () {
        var availableWormColorIds = wormColorIds.filter(colorId => this.props.matchConfig.players.every(p => p.colorId !== colorId));

        var rows = this.props.lobbyData.players.map(function (player) {
            var leftKey, onLeftKeyPicked, rightKey, onRightKeyPicked;
            if (player.id === this.props.playerData.playerId) {
                leftKey = this.props.playerData.left;
                onLeftKeyPicked = this.onKeyChange.bind(this, "left");
                rightKey = this.props.playerData.right;
                onRightKeyPicked = this.onKeyChange.bind(this, "right");
            }

            return (
                <tr key={player.id}>
                    <td className="col-bot">
                        <img src={"svg/human.svg"} alt="X"/>
                    </td>
                    <td className="col-color">
                        <ColorPicker colorId={player.colorId} availableWormColorIds={availableWormColorIds} onColorSelected={player.id === this.props.playerData.playerId ? this.props.onColorChange : undefined}/>
                    </td>
                    <td className="col-name">
                        {player.name}
                    </td>
                    <KeyPicker currentKey={leftKey} onKeyPicked={onLeftKeyPicked} />
                    <KeyPicker currentKey={rightKey} onKeyPicked={onRightKeyPicked} />
                    <td className="col-ready">
                        {player.ready ? "ready" : null}
                    </td>
                </tr>
            );
        }, this);

        var controlledPlayer = this.props.lobbyData.players.find(p => p.id === this.props.playerData.playerId);
        var readyButton = controlledPlayer.ready ? null : <button className="btn btn-primary" onClick={this.props.onReadyAction}>Ready</button>;
        var leaveButton = this.props.onLeaveAction ? <button className="btn btn-secondary" onClick={this.props.onLeaveAction}>Leave</button> : null;

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
                                <div>
                                    {readyButton}
                                </div>
                                <div>
                                    {leaveButton}
                                </div>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="game-settings">
                    <div>
                        <GamePreview matchConfig={this.props.matchConfig} />
                    </div>
                </div>
            </div>
        );
    },
    onKeyChange: function (target, newKey) {
        this.props.playerData[target] = newKey;
        this.forceUpdate();
    }
});
