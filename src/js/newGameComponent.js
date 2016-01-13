var React = require('react');

var Table = React.createClass({
    render: function () {
        var rows = this.props.players.map(function (player) {
            var bot = player.bot;
            var color = player.color;
            var name = player.name;
            var left = bot ? null : player.left;
            var right = bot ? null : player.right;
            var removeButton = this.props.players.length > 2 ? <button onClick={this.onRemoveClick.bind(this, player.id)}>X</button> : null;
            return (
                <tr key={player.id}>
                    <td>
                        <input type="checkbox" checked={bot} onChange={this.onBotChange.bind(this, player.id)}/>
                    </td>
                    <td>{color}</td>
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

        return (
            <table>
                <thead>
                <tr>
                    <th>Bot</th>
                    <th>Color</th>
                    <th>Name</th>
                    <th>Left</th>
                    <th>Right</th>
                    <th>X</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    },
    onNameChange: function (playerId, event) {
        this.props.onNameChange(playerId, event.target.value);
    },
    onBotChange: function (playerId, event) {
        this.props.onBotChange(playerId, event.target.checked);
    },
    onRemoveClick: function (playerId) {
        this.props.onRemoveClick(playerId);
    }
});


module.exports = React.createClass({
    displayName: 'NewGame',
    getInitialState: function () {
        return {
            nextId: 2,
            players: [
                {
                    bot: false,
                    color: "blue",
                    name: "Olle",
                    left: "A",
                    right: "B",
                    id: 0
                },
                {
                    bot: true,
                    color: "blue",
                    name: "SuperBot",
                    left: "K",
                    right: "L",
                    id: 1
                }
            ]
        };
    },
    render: function () {
        return (
            <div>
                <Table players={this.state.players}
                       onNameChange={this.onNameChange}
                       onBotChange={this.onBotChange}
                       onRemoveClick={this.onRemoveClick}/>
                <button onClick={this.onAddPlayerClick}>Add player</button>
                <button>Play</button>
            </div>
        );
    },
    onAddPlayerClick: function () {
        this.setState(function (prevState) {
            return {
                players: prevState.players.concat([{
                    bot: false,
                    color: "blue",
                    name: "New player",
                    left: "A",
                    right: "B",
                    id: prevState.nextId
                }]),
                nextId: prevState.nextId + 1
            };
        });
    },
    getPlayer: function (playerId) {
        return this.state.players.find(function (player) {
            return player.id === playerId;
        });
    },
    onNameChange: function (playerId, name) {
        var player = this.getPlayer(playerId);
        player.name = name.substring(0, 15);
        this.forceUpdate();
    },
    onBotChange: function (playerId, isBot) {
        var player = this.getPlayer(playerId);
        player.bot = isBot;
        this.forceUpdate();
    },
    onRemoveClick: function (playerId) {
        var players = this.state.players.filter(function (player) {
            return player.id !== playerId;
        });
        this.setState({players: players});
    }
});
