var defaultValues = module.exports = {};


var color = function (hex) {
    function hexToRGB(hex) {

        if (hex.length === 4) {
            hex += hex.substring(1, 4);
        }

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ];
    }

    var rgb = hexToRGB(hex);

    return {
        rgb: rgb,
        hex: hex
    };
};

var prettyColors = {
    white: color("#FFF"),
    black: color("#444"),
    yellow: color("#FDD835"),
    orange: color("#FF9800"),
    red: color("#F44336"),
    pink: color("#E91E63"),
    purple: color("#9C27B0"),
    indigo: color("#3F51B5"),
    blue: color("#03A9F4"),
    turqoise: color("#009688"),
    green: color("#8BC34A")
};
defaultValues.player = {};
defaultValues.player.KEY_BINDINGS = [[37, 39], [65, 83], [75, 76], [53, 54], [96, 110], [66, 78], [104, 105], [49, 50], [188, 190], [90, 88], [67, 86], [51, 52], [55, 56], [57, 48], [79, 80], [71, 72]];

defaultValues.player.COLORS = [prettyColors.black.rgb, prettyColors.yellow.rgb, prettyColors.orange.rgb, prettyColors.red.rgb, prettyColors.pink.rgb, prettyColors.purple.rgb, prettyColors.indigo.rgb, prettyColors.blue.rgb, prettyColors.turqoise.rgb, prettyColors.green.rgb];
defaultValues.player.COLOR_STRINGS = [prettyColors.black.hex, prettyColors.yellow.hex, prettyColors.orange.hex, prettyColors.red.hex, prettyColors.pink.hex, prettyColors.purple.hex, prettyColors.indigo.hex, prettyColors.blue.hex, prettyColors.turqoise.hex, prettyColors.green.hex];


function getColorString(rgb) {

    function toHex(n) {
        var res = n.toString(16);
        while (res.length < 2) {
            res = "0" + res;
        }
        return res;
    }

    return "#" + rgb.map(toHex).join("");
}