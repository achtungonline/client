var React = require('react');

var ColorPicker = React.createClass({
    propTypes: {
        colorId: React.PropTypes.any.isRequired,
        availableColorIds: React.PropTypes.array.isRequired,
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

        function getColorElements(colorIds) {
            return colorIds.map(function (colorId) {
                return (<div key={colorId} className={"color-picker bg-" + colorId} onClick={thisComponent.onAvailableColorClick.bind(thisComponent, colorId)}></div>);
            });
        }

        var selectionList;
        if (this.state.expanded) {
            selectionList = (
                <div className="color-picker-list">
                    {getColorElements(this.props.availableColorIds.filter(c => c !== thisComponent.props.colorId))}
                </div>
            );
        }

        return (
            <div ref="colorPicker" className="color-picker">
                <div className={"color-picker-selected bg-" + this.props.colorId} onClick={this.onSelectedColorClick}></div>
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
    onAvailableColorClick: function (colorId) {
        this.setState({
            expanded: false
        });
        this.props.onColorSelected(colorId);
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
    displayName: 'NewMatch',
    render: function () {
        var rows = this.props.players.map(function (player) {
            var bot = player.bot;
            var colorId = player.colorId;
            var name = player.name;
            var left = bot ? null : player.left;
            var right = bot ? null : player.right;
            var removeButton = this.props.players.length > 2 ? <button onClick={this.onRemoveClick.bind(this, player.id)}>X</button> : null;
            return (
                <tr key={player.id}>
                    <td>
                        <input type="checkbox" checked={bot} onChange={this.onBotChange.bind(this, player.id)}/>
                    </td>
                    <td><ColorPicker colorId={colorId} availableColorIds={this.props.availableColorIds} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/></td>
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

        var maxPlayersReached = this.props.players.length >= this.props.availableColorIds.length;
        var maxPlayersReachedText = maxPlayersReached ? <p>Stop pretending, we know you don't have that many friends to play with.</p> : null;

        return (
            <div>
                <button disabled={maxPlayersReached} onClick={this.props.onAddPlayerAction}>Add player</button>
                <button onClick={this.props.onStartMatchAction}>Play</button>
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
