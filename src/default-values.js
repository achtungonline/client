var defaultValues = module.exports = {};

defaultValues.player = player = {};
player.KEY_BINDINGS = [[37, 39], [65, 83], [75, 76], [53, 54], [96, 110], [66, 78], [104, 105], [49, 50], [188, 190], [90, 88], [67, 86], [51, 52], [55, 56], [57, 48], [79, 80], [71, 72]];
player.COLORS = [[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255],[255,255,255],[0,80,0],[80,0,0],[0,0,80]];
player.COLOR_STRINGS = player.COLORS.map(getColorString);

function getColorString(rgb) {

    function toHex(n) {
        var res = n.toString(16);
        while (res.length < 2) {
            res = "0"+res;
        }
        return res;
    }

    return "#" + rgb.map(toHex).join("");
}