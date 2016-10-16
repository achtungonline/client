function isInputElementActive() {
    return document.activeElement.nodeName === "INPUT";
}

export {
    isInputElementActive
}