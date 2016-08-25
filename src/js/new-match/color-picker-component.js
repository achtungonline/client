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
        document.addEventListener("click", this.onDocumentClick);
    },
    render: function () {
        var thisComponent = this;

        function getColorElements(colors) {
            return colors.map(function (color) {
                return (<div key={color.id} className="color-picker" style={{backgroundColor: color.hexCode}} onClick={thisComponent.onAvailableColorClick.bind(thisComponent, color)}></div>);
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
                <div className="color-picker-selected" style={{backgroundColor: this.props.color.hexCode}} onClick={this.onSelectedColorClick}></div>
                {selectionList}
            </div>
        )
    },
    componentWillUnmount: function () {
        document.removeEventListener("click", this.onDocumentClick);
    },
    onSelectedColorClick: function () {
        this.setState({
            expanded: !this.state.expanded
        });
    },
    onAvailableColorClick: function (color) {
        this.setState({
            expanded: false
        });
        this.props.onColorSelected(color);
    },
    onDocumentClick: function (e) {
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

        if (!isDescendant(e.target, this.refs.colorPicker)) {
            this.setState({
                expanded: false
            });
        }
    }
});