var React = require("react");
module.exports = React.createClass({
    displayName: "Header",
    render: function () {
        return (
            <div className="flex heading flex-space-between flex-align-end">
                <h1>Achtung Online</h1>
                <div>
                    <div className="fb-like" data-href="https://www.facebook.com/achtungonline" data-layout="button_count" data-action="like" data-size="small" data-show-faces="true" data-share="false"></div>
                    <a href="https://www.facebook.com/achtungonline">
                        <img className="m-l-2" style={{WebkitUserSelect: "none"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/1024px-F_icon.svg.png" width="30px"/>
                    </a>
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        console.log("Mounted");
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))  {
                return;
            }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=1197069846991445";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, "script", "facebook-jssdk"));
    }
});
