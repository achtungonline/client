var ReactDOM = require("react-dom");
var React = require("react");
var Component = require("./component.js");

document.addEventListener("DOMContentLoaded", function (event) {
    var mainContainer = document.getElementById("main");
    ReactDOM.render(<Component initialView="newMatch" />, mainContainer);
});
