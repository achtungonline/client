var React = require("react");
module.exports = React.createClass({
    displayName: "Header",
    render: function () {
        return (
            <div className="flex heading flex-space-between flex-align-end">
                <h1>Achtung Online</h1>
                <div>
                    <div
                        className="fb-like"
                        data-share="true"
                        data-width="450"
                        data-show-faces="true">
                    </div>
                </div>
                <div class="fb-page" data-href="https://www.facebook.com/achtungonline/" data-tabs="timeline" data-height="70" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
                    <blockquote cite="https://www.facebook.com/achtungonline/" class="fb-xfbml-parse-ignore">
                        <a href="https://www.facebook.com/achtungonline/">
                            Achtung Online
                        </a>
                    </blockquote>
                </div>
            </div>
        )
    }
});