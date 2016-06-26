var React = require("react");
module.exports = React.createClass({
    displayName: "Header",
    render: function () {
        return (
            <div className="heading">
                <h1>Achtung Online</h1>
                <div
                    className="fb-like"
                    data-share="true"
                    data-width="450"
                    data-show-faces="true">
                </div>
            </div>
        )
    }
});