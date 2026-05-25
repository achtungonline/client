function isInputElementActive() {
    return document.activeElement.nodeName === "INPUT";
}

var MOBILE_BREAKPOINT_PX = 900;

function isMobile() {
    if (typeof window === "undefined") {
        return false;
    }
    var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var narrow = window.innerWidth <= MOBILE_BREAKPOINT_PX;
    return coarse || narrow;
}

export {
    isInputElementActive,
    isMobile,
    MOBILE_BREAKPOINT_PX
}