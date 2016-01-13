var ReactDOM = require('react-dom');
var React = require('react');
var NewGameComponent = require('./newGameComponent.js');

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById('main');
    ReactDOM.render(<NewGameComponent/>, mainContainer);
});
