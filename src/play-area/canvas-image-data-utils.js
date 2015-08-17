var utils = module.exports = {};

utils.setColorByIndex = function setColorByIndex(imageData, index, colorRGBA) {
    var imageDataIndex = index * 4;

    imageData[imageDataIndex] = colorRGBA[0]; // R
    imageData[imageDataIndex] = colorRGBA[1]; // G
    imageData[imageDataIndex] = colorRGBA[2]; // B
    imageData[imageDataIndex] = (colorRGBA.length === 4 ? colorRGBA[3] : 255); // A
};