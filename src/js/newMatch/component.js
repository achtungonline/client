var React = require("react");
var utils = require("./../utils.js");
var CoreGameFactory = require("core/src/game-factory.js");
var GameCanvasRenderer = require("../match/canvas/game-canvas-renderer.js");
var LocalGameHandler = require("../match/local-game/local-game-handler.js");

var coreGameFactory = CoreGameFactory();

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

var GamePreview = React.createClass({
    shouldComponentUpdate: function (nextProps) {
        return this.props.matchConfig.map.name !== nextProps.matchConfig.map.name || (this.props.players.length !== nextProps.players.length);
    },
    render: function () {
        return (
            <div ref="gameCanvas"></div>
        );
    },
    componentDidMount: function () {
        this.componentDidUpdate();
    },
    componentDidUpdate: function () {
        var game = coreGameFactory.create({
            seed: Math.floor((Math.random() * 100000)),
            map: this.props.matchConfig.map,
            playerConfigs: this.props.matchConfig.playerConfigs.map(function (pc) {
                return {
                    id: pc.id,
                    type: "bot"
                }
            })
        });
        if (this.localGame) {
            this.localGame.stop();
        }
        var localGame = LocalGameHandler({game: game, playerConfigs: this.props.players});
        localGame.start();
        this.localGame = localGame;

        var mapBorderWidth = 10;
        var scale = 520 / (this.props.matchConfig.map.width + mapBorderWidth * 2);


        var gameCanvasRenderer = GameCanvasRenderer({gameState: localGame.gameState, playerConfigs: this.props.players, scale: scale, mapBorderWidth: mapBorderWidth});
        this.localGame.on(localGame.events.GAME_UPDATED, gameCanvasRenderer.render);
        var container = this.refs.gameCanvas;
        container.innerHTML = "";
        container.appendChild(gameCanvasRenderer.container);
    },
    componentWillUnmount: function () {
        if (this.localGame) {
            this.localGame.stop();
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
            var removeButton = this.props.players.length > 2 ? <button className="btn-clean btn-remove-player" onClick={this.onRemoveClick.bind(this, player.id)}><img src="src/css/svg/cross.svg" alt="X"/></button> : null;


            return (
                <tr key={player.id}>
                    <td className="col-bot">
                        <button className="btn-clean" onClick={this.onBotChange.bind(this, player.id, !bot)}>
                            <img src={bot ? "src/css/svg/computer.svg" : "src/css/svg/human.svg"} alt="X"/>
                        </button>
                    </td>
                    <td className="col-color"><ColorPicker color={color} availableWormColors={this.props.availableWormColors} onColorSelected={this.onPlayerColorChange.bind(this, player.id)}/></td>
                    <td className="col-name">
                        <input className="input" type="text" onChange={this.onNameChange.bind(this, player.id)} value={name}/>
                    </td>
                    <td className="col-left">{left}</td>
                    <td className="col-right">{right}</td>
                    <td className="col-remove">
                        {removeButton}
                    </td>
                </tr>
            );
        }, this);

        var maxPlayersReached = this.props.players.length >= this.props.availableWormColors.length;
        var addPlayerButton = maxPlayersReached ? null : <button className="btn btn-secondary btn-add-player" onClick={this.props.onAddPlayerAction}>Add player</button>;

        return (
            <div className="flex flex-space-between new-match">
                <div style={{width: 543}}>
                    <table className="table table-player" cellSpacing="0" cellPadding="0">
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                    <div className="m-t-2" style={{width: 475}}>
                        {addPlayerButton}
                        <button className="btn btn-primary" onClick={this.props.onStartMatchAction}>Start</button>
                    </div>
                </div>
                <div className="game-settings">
                    <div className="flex flex-space-between">
                        <div className="select select-primary side" style={{marginTop: "auto"}}>
                            <select value={this.props.selectedMap} onChange={this.onMapChange}>
                                <option value="Square 500">Small Square</option>
                                <option value="Square 800">Medium Square</option>
                                <option value="Square 1100">Large Square</option>
                                <option value="Circle 500">Small Circle</option>
                                <option value="Circle 800">Medium Circle</option>
                                <option value="Circle 1100">Large Circle</option>
                                <option value="Rectangle 1100 400">Rectangle</option>
                                <option value="Full Sized Rectangle">Max Sized Rectangle</option>
                            </select>
                        </div>
                        <div className="flex max-score">
                            <img style={{marginTop: "auto"}} src="src/css/svg/trophy.svg" alt="Max score: "/>
                            <input style={{marginTop: "auto"}} className="input" type="number" value={this.props.maxScore} onChange={this.onMaxScoreChange}/>
                        </div>
                    </div>
                    <div>
                        <GamePreview matchConfig={this.props.matchConfig} players={this.props.players}/>
                    </div>
                </div>
            </div>
        );
    },
    onMaxScoreChange: function (event) {
        this.props.onMaxScoreChangeAction(event.target.value);
    },
    onMapChange: function (event) {
        this.props.onMapChangeAction(event.target.value);
    },
    onNameChange: function (playerId, event) {
        this.props.onNameChangeAction(playerId, event.target.value);
    },
    onBotChange: function (playerId, isBot, event) {
        this.props.onIsBotChangeAction(playerId, isBot);
    },
    onRemoveClick: function (playerId) {
        this.props.onRemovePlayerAction(playerId);
    },
    onPlayerColorChange: function (playerId, colorId) {
        this.props.onPlayerColorChangeAction(playerId, colorId);
    }
});
