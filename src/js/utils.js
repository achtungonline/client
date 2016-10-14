function hexToRgb(hexString) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexString = hexString.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function rgbToHex(rgbArray) {
    return "#" + ((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1);
}

function keyCodeToString(keyCode) {
    var keyCodeMap = {};
    keyCodeMap[37] = "LEFT";
    keyCodeMap[39] = "RIGHT";
    keyCodeMap[38] = "UP";
    keyCodeMap[40] = "DOWN";

    return keyCodeMap[keyCode] || String.fromCharCode(keyCode);
}

export {
    hexToRgb,
    rgbToHex,
    keyCodeToString
}

