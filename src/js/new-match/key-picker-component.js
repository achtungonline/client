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
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener("keydown", this.onKeyDown);
    },
    render: function () {
        var className = "col-keybinding";
        if (this.state.selected) {
            className += " col-selected";
        }

        return (
            <td ref="keyPicker" className={className} style={this.props.onKeyPicked ? {cursor: "pointer"} : {}}>
                {this.props.currentKey}
            </td>
        )
    },
    componentWillUnmount: function () {
        document.removeEventListener("mousedown", this.onMouseDown);
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
    onMouseDown: function (event) {
        if (event.target === this.refs.keyPicker) {
            if (this.props.onKeyPicked) {
                event.preventDefault();
                if (!this.state.selected) {
                    this.setState({selected: true});
                }
            }
        } else {
            if (this.state.selected) {
                this.setState({selected: false});
            }
        }
    }
});