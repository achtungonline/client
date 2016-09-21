var React = require("react");

var wormColors = require("core/src/core/constants.js").wormColors;

module.exports = React.createClass({
    propTypes: {
        colorId: React.PropTypes.string.isRequired,
        availableWormColorIds: React.PropTypes.array.isRequired,
        onColorSelected: React.PropTypes.func
    },
    getInitialState: function () {
        return {expanded: false};
    },
    componentDidMount: function () {
        document.addEventListener("mousedown", this.onMouseDown);
    },
    render: function () {
        var thisComponent = this;

        function getColorElements(colorIds) {
            return colorIds.map(colorId =>
                <div key={colorId} className="color-picker" style={{backgroundColor: wormColors[colorId]}} onMouseDown={thisComponent.onAvailableColorClick.bind(thisComponent, colorId)}></div>
            );
        }

        var selectionList;
        if (this.state.expanded) {
            selectionList = (
                <div className="color-picker-list">
                    {getColorElements(this.props.availableWormColorIds.filter(colorId => colorId !== thisComponent.props.colorId))}
                </div>
            );
        }

        return (
            <div ref="colorPicker" className="color-picker">
                <div className="color-picker-selected" onMouseDown={this.props.onColorSelected ? this.onSelectedColorClick : undefined} style={{backgroundColor: wormColors[this.props.colorId]}}></div>
                {selectionList}
            </div>
        )
    },
    componentWillUnmount: function () {
        document.removeEventListener("mousedown", this.onMouseDown);
    },
    onSelectedColorClick: function (event) {
        event.preventDefault();
        this.setState({
            expanded: !this.state.expanded
        });
    },
    onAvailableColorClick: function (colorId, event) {
        event.preventDefault();
        this.setState({
            expanded: false
        });
        this.props.onColorSelected(colorId);
    },
    onMouseDown: function (event) {
        function isDescendant(child, parent) {
            var node = child.parentNode;
            while (node) {
                if (node === parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        }

        if (!isDescendant(event.target, this.refs.colorPicker)) {
            this.setState({
                expanded: false
            });
        }
    }
});