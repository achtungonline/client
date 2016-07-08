var React = require("react");
module.exports = React.createClass({
    displayName: "Header",
    render: function () {
        var svgTag='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 266.893 266.895" enable-background="new 0 0 266.893 266.895" xml:space="preserve">' +
            '<path id="Blue_1_" fill="#4267b2" d="M248.082,262.307c7.854,0,14.223-6.369,14.223-14.225V18.812  c0-7.857-6.368-14.224-14.223-14.224H18.812c-7.857,0-14.224,6.367-14.224,14.224v229.27c0,7.855,6.366,14.225,14.224,14.225  H248.082z"/>' +
            '<path id="f" fill="#FFFFFF" d="M182.409,262.307v-99.803h33.499l5.016-38.895h-38.515V98.777c0-11.261,3.127-18.935,19.275-18.935  l20.596-0.009V45.045c-3.562-0.474-15.788-1.533-30.012-1.533c-29.695,0-50.025,18.126-50.025,51.413v28.684h-33.585v38.895h33.585  v99.803H182.409z"/>' +
            '</svg>';

        return (
            <div className="flex heading flex-space-between flex-align-end">
                <h1>Achtung Online</h1>
                <div className="flex flex-align-center flex-self-center">
                <img width="45px" src="https://upload.wikimedia.org/wikipedia/commons/2/27/W21-1a.svg"/>
                    <small className="m-l-2">Website Under construction</small>
                    </div>
                <div>
                    <div className="fb-like" data-href="https://www.facebook.com/achtungonline" data-layout="button_count" data-action="like" data-size="small" data-show-faces="true" data-share="false"></div>
                    <a target="_blank" className="facebook-page-link m-l-2" href="https://www.facebook.com/achtungonline" dangerouslySetInnerHTML={{__html: svgTag}}/>
                </div>
            </div>
        )
    },
    componentDidMount: function () {
        console.log("Mounted");
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=1197069846991445";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, "script", "facebook-jssdk"));
    }
});
