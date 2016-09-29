var keyCodeMapping = {
    8: "BACK",
    9: "TAB",
    12: "NUM5",
    13: "ENTER",
    16: "SHIFT", // { 1: "L-SHIFT", 2: "R-SHIFT" }, // Allowing both L- R-SHIFT introduced buggy behavior when pressed simultaneously
    17: { 1: "L-CTRL", 2: "R-CTRL" },
    18: { 1: "L-ALT", 2: "R-ALT" },
    19: "BREAK",
    20: "CAPS",
    27: "ESC",
    32: "SPACE",
    33: { 0: "P-UP", 3: "NUM9" },
    34: { 0: "P-DOWN", 3: "NUM3" },
    35: { 0: "END", 3: "NUM1" },
    36: { 0: "HOME", 3: "NUM7" },
    37: { 0: "LEFT", 3: "NUM4" },
    38: { 0: "UP", 3: "NUM8" },
    39: { 0: "RIGHT", 3: "NUM6" },
    40: { 0: "DOWN", 3: "NUM2" },
    45: { 0: "INSERT", 3: "NUM0" },
    46: { 0: "DELETE", 3: "NUM." },
    91: "L-COM",
    93: "R-COM",
    106: "NUM*",
    107: "NUM+",
    109: "NUM-",
    110: "NUM.",
    111: "NUM/",
    144: "N-LOCK",
    145: "S-LOCK",
    182: "MY-COMP",
    183: "MY-CALC",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "\'"
};

// Letters
for (var i = 60; i < 91; i++) {
    keyCodeMapping[i] = String.fromCharCode(i);
}

// Digits
for (var i = 48; i < 58; i++) {
    keyCodeMapping[i] = (i-48) + "";
}

// function keys
for (var i = 1; i < 13; i++) {
    keyCodeMapping[i + 111] = "F" + i;
}

// numpad keys
for (var i = 0; i < 10; i++) {
    keyCodeMapping[i + 96] = "NUM" + i;
}

var keyPairs = [
    {
        left: "A",
        right: "S"
    },
    {
        left: "DOWN",
        right: "RIGHT"
    },
    {
        left: "Y",
        right: "U"
    },
    {
        left: "C",
        right: "V"
    },
    {
        left: "Z",
        right: "X"
    },
    {
        left: "K",
        right: "L"
    },
    {
        left: "B",
        right: "N"
    },
    {
        left: "Q",
        right: "W"
    },
    {
        left: "H",
        right: "J"
    },
    {
        left: "D",
        right: "F"
    }
];

function parseEvent(keyEvent) {
    // Keyboard Events
    var keyCode = keyEvent.which || keyEvent.keyCode || keyEvent.charCode;

    var value = keyCodeMapping[keyCode];
    if (typeof value === "object") {
        return value[keyEvent.location];
    } else {
        return value;
    }
}

var CONTINUE_KEY = "SPACE";
var ENTER_KEY = "ENTER";
var REMOVE_KEY = "BACK";
function isReservedKey(keyName) {
    return keyName === ENTER_KEY || keyName === CONTINUE_KEY || keyName === REMOVE_KEY;
}

module.exports = {
    isReservedKey,
    keyPairs,
    parseEvent,
    CONTINUE_KEY,
    ENTER_KEY,
    REMOVE_KEY
};