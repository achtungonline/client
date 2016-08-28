var React = require("react");

module.exports = React.createClass({
    propTypes: {
        color: React.PropTypes.object.isRequired,
        availableWormColors: React.PropTypes.array.isRequired,
        onColorSelected: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {expanded: false};
    },
    componentDidMount: function () {
        document.addEventListener("mousedown", this.onMouseDown);
    },
    render: function () {
        var thisComponent = this;

        function getColorElements(colors) {
            return colors.map(function (color) {
                return (<div key={color.id} className="color-picker" style={{backgroundColor: color.hexCode}} onMouseDown={thisComponent.onAvailableColorClick.bind(thisComponent, color)}></div>);
            });
        }

        var selectionList;
        if (this.state.expanded) {
            selectionList = (
                <div className="color-picker-list">
                    {getColorElements(this.props.availableWormColors.filter(c => c.id !== thisComponent.props.color.id))}
                </div>
            );
        }

        return (
            <div ref="colorPicker" className="color-picker">
                <div className="color-picker-selected" onMouseDown={this.onSelectedColorClick} style={{backgroundColor: this.props.color.hexCode}}></div>
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
    onAvailableColorClick: function (color, event) {
        event.preventDefault();
        this.setState({
            expanded: false
        });
        this.props.onColorSelected(color);
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