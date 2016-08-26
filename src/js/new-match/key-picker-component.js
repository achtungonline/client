var React = require("react");

var parseEvent = require("../key-util.js").parseEvent;

module.exports = React.createClass({
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
        document.addEventListener("click", this.onDocumentClick);
        document.addEventListener("keydown", this.onKeyDown);
    },
    render: function () {
        var className = "col-keybinding";
        if (this.state.selected) {
            className += " col-selected";
        }
        return (
            <td ref="keyPicker" className={className}>
                {this.props.currentKey}
            </td>
        )
    },
    componentWillUnmount: function () {
        document.removeEventListener("click", this.onDocumentClick);
        document.removeEventListener("keydown", this.onKeyDown);
    },
    onKeyPickerClick: function () {
        if (!this.state.selected) {
            this.setState({ selected: true });
        }
    },
    onKeyDown: function(event) {
        if (this.state.selected) {
            event.preventDefault();
            var newKey = parseEvent(event);
            if (newKey) {
                this.setState({ selected: false });
                this.props.onKeyPicked(newKey);
            }
        }
    },
    onDocumentClick: function (event) {
        if (this.props.onKeyPicked) {
            if (event.target === this.refs.keyPicker) {
                if (!this.state.selected) {
                    this.setState({ selected: true });
                }
            } else {
                if (this.state.selected) {
                    this.setState({ selected: false });
                }
            }
        }
    }
});