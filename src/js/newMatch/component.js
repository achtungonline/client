var React = require("react");
var utils = require("./../utils.js");

var ColorPicker = React.createClass({
    propTypes: {
        color: React.PropTypes.any.isRequired,
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

module.exports = React.createClass({
    displayName: "NewMatch",
    render: function () {
        var rows = this.props.players.map(function (player) {
            var bot = player.bot;
            var color = player.color;
            var name = player.name;
            var left = bot ? null : utils.keyCodeToString(player.left);
            var right = bot ? null : utils.keyCodeToString(player.right);
            var removeButton = this.props.players.length > 2 ? <button onClick={this.onRemoveClick.bind(this, player.id)}>X</button> : null;
            return (
                <tr key={player.id}>
                    <td>
                        <input type="checkbox" checked={bot} onChange={this.onBotChange.bind(this, player.id)}/>
                    </td>
                    <td><ColorPicker color={color} availableWormColors={this.props.availableWormColors} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/></td>
                    <td>
                        <input type="text" onChange={this.onNameChange.bind(this, player.id)} value={name}/>
                    </td>
                    <td>{left}</td>
                    <td>{right}</td>
                    <td>
                        {removeButton}
                    </td>
                </tr>
            );
        }, this);

        var maxPlayersReached = this.props.players.length >= this.props.availableWormColors.length;
        var maxPlayersReachedText = maxPlayersReached ? <p>Stop pretending, we know you don"t have that many friends to play with.</p> : null;

        return (
            <div align="center">
                <button disabled={maxPlayersReached} onClick={this.props.onAddPlayerAction}>Add player</button>
                <button onClick={this.props.onStartMatchAction}>Play</button>
                <label>Select maps</label>
                <select defaultValue="Square 800" value={this.props.selectedMap} onChange={this.onMapChange}>
                    <option value="Square 500">Small Square</option>
                    <option value="Square 800">Medium Square</option>
                    <option value="Square 1100">Large Square</option>
                    <option value="Circle 500">Small Circle</option>
                    <option value="Circle 800">Medium Circle</option>
                    <option value="Circle 1100">Large Circle</option>
                    <option value="Rectangle 1100 400">Rectangle</option>
                    <option value="Full Sized Rectangle">Max Sized Rectangle</option>
                </select>
                Max Score: <input type="number" value={this.props.maxScore} onChange={this.onMaxScoreChange}/>
                <table>
                    <thead>
                    <tr>
                        <th>Bot</th>
                        <th>Color</th>
                        <th>Name</th>
                        <th>Left</th>
                        <th>Right</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
                {maxPlayersReachedText}
            </div>
        );
    },
    onMaxScoreChange: function(event) {
        this.props.onMaxScoreChangeAction(event.target.value);
    },
    onMapChange: function (event) {
        this.props.onMapChangeAction(event.target.value);
    },
    onNameChange: function (playerId, event) {
        this.props.onNameChangeAction(playerId, event.target.value);
    },
    onBotChange: function (playerId, event) {
        this.props.onIsBotChangeAction(playerId, event.target.checked);
    },
    onRemoveClick: function (playerId) {
        this.props.onRemovePlayerAction(playerId);
    },
    onPlayerColorChange: function (playerId, colorId) {
        this.props.onPlayerColorChangeAction(playerId, colorId);
    }
});
