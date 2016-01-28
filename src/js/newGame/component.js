var React = require('react');

var availableColorIds = ["black", "yellow", "orange", "red", "pink", "purple", "indigo", "blue", "turquoise", "green"];
var availableNames = [
    "My hat man gandi", "Bill Gates", "Barack Obama", "Pope Francis", "Angela Merkel", "Queen Elizabeth", "Mother Teresa", "Gustav Vasa", "Knugen", "Jesus Christ",
    "Adolf Hitler", "Donald Trump", "Vladimir Putin", "Osama bin Laden", "Kim Jong-un", "Mao Zedong", "Joseph Stalin", "Prophet Muhammad", "Steve Jobs", "Benito Mussolini"];

function getUnusedNames(players) {
    var usedNames = players.map(p => p.name);
    return availableNames.filter(n => usedNames.indexOf(n) === -1);
}

function getRandomUnusedName(players) {
    var unusedNames = getUnusedNames(players);
    return unusedNames[Math.floor(Math.random() * unusedNames.length)];
}

function getPlayer(players, playerId) {
    return players.find(function (player) {
        return player.id === playerId;
    });
}

function getUnusedColorIds(players) {
    var usedColors = players.map(p => p.colorId);
    return availableColorIds.filter(c => usedColors.indexOf(c) === -1);
}

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

var Table = React.createClass({
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
                    <td><ColorPicker colorId={colorId} availableColorIds={availableColorIds} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/></td>
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
                    <th></th>
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
    },
    onPlayerColorChange: function (playerId, colorId) {
        this.props.onPlayerColorChange(playerId, colorId);
    }
});

module.exports = React.createClass({
    displayName: 'NewGame',
    getInitialState: function () {
        var firstName = getRandomUnusedName([]);
        var secondName = getRandomUnusedName([{name: firstName}]);
        return {
            nextId: 2,
            players: [
                {
                    bot: false,
                    colorId: "blue",
                    name: firstName,
                    left: "A",
                    right: "B",
                    id: 0
                },
                {
                    bot: true,
                    colorId: "red",
                    name: secondName,
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
                <button disabled={this.state.players.length >= availableColorIds.length} onClick={this.onAddPlayerClick}>Add player</button>
                <button>Play</button>
                <Table players={this.state.players}
                       onNameChange={this.onNameChange}
                       onBotChange={this.onBotChange}
                       onRemoveClick={this.onRemoveClick}
                       onPlayerColorChange={this.onPlayerColorChange}/>
            </div>
        );
    },
    onAddPlayerClick: function () {
        this.setState(function (prevState) {
            var name = getRandomUnusedName(prevState.players);
            return {
                players: prevState.players.concat([{
                    bot: false,
                    colorId: getUnusedColorIds(prevState.players)[0],
                    name: name,
                    left: "A",
                    right: "B",
                    id: prevState.nextId
                }]),
                nextId: prevState.nextId + 1
            };
        });
    },
    onNameChange: function (playerId, name) {
        this.setState(function (oldState) {
            var player = getPlayer(oldState.players, playerId);
            player.name = name.substring(0, 20);
            return {players: oldState.players};
        });

    },
    onBotChange: function (playerId, isBot) {
        this.setState(function (oldState) {
            var player = getPlayer(oldState.players, playerId);
            player.bot = isBot;
            return {players: oldState.players};
        });
    },
    onRemoveClick: function (playerId) {
        var players = this.state.players.filter(function (player) {
            return player.id !== playerId;
        });
        this.setState({players: players});
    },
    onPlayerColorChange: function (playerId, colorId) {
        this.setState(function (oldState) {
            var oldPlayerWithColor = oldState.players.find(function (p) {
                return p.colorId === colorId;
            });

            var newPlayerWithColor = getPlayer(oldState.players, playerId);

            if (oldPlayerWithColor) {
                // The picked color is occupied, so the players need to swap colors.
                oldPlayerWithColor.colorId = newPlayerWithColor.colorId;
            }

            newPlayerWithColor.colorId = colorId;

            return {
                players: oldState.players
            };
        });
    }
});
