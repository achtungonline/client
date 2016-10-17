import React from "react";

import {isReservedKey, parseEvent} from "../key-util.js";

export default React.createClass({
    propTypes: {
        currentKey: React.PropTypes.string,
        onKeyPicked: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            selected: false
        };
    },
    componentDidMount: function () {
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener("keydown", this.onKeyDown);
    },
    render: function () {
        var className = "col-keybinding animation-size-expand-hover";
        if (this.state.selected) {
            className += " col-selected";
        }

        return (
            <td ref="keyPicker" className={className} onClick={this.onClick} style={this.props.onKeyPicked ? {cursor: "pointer"} : {}}>

                <div className="animation-size-expand">{this.props.currentKey}</div>
            </td>
        )
    },
    componentWillUnmount: function () {
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("keyup", this.onKeyUp);
    },
    onKeyDown: function (event) {
        if (this.state.selected) {
            event.preventDefault();
        }
    },
    onKeyUp: function (event) {
        if (this.state.selected) {
            event.preventDefault();
            var newKey = parseEvent(event);
            if (newKey && !isReservedKey(newKey)) {
                this.setState({selected: false});
                this.props.onKeyPicked(newKey);
            }
        }
    },
    onClick: function (event) {
        this.setState({selected: !this.state.selected});
    },
    onMouseUp: function (event) {
        if (this.state.selected) {
            this.setState({selected: false});
        }
    }
});