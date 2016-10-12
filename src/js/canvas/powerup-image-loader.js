var forEach = require("core/src/core/util/for-each.js");

var POWERUP_IMAGE_URLS = {
    "clear": "svg/powerup/clear.svg",
    "drunk": "svg/powerup/drunk.svg",
    "fat": "svg/powerup/fat.svg",
    "slim": "svg/powerup/slim.svg",
    "slow": "svg/powerup/slow.svg",
    "slow_turn": "svg/powerup/slowturn.svg",
    "speed": "svg/powerup/speed.svg",
    "super_jump": "svg/powerup/superjump.svg",
    "switcharoonie": "svg/powerup/switcharoonie.svg",
    "key_switch": "svg/powerup/switchkeys.svg",
    "tron_turn": "svg/powerup/tronturn.svg",
    "quick_turn": "svg/powerup/quickturn.svg",
    "twin": "svg/powerup/twin.svg",
    "wall_hack": "svg/powerup/wallhack.svg"
};
var imageElements = {};

forEach(POWERUP_IMAGE_URLS, (svgPath,key) => {
    var imageElement = document.createElement("img");
    imageElement.src = svgPath;
    imageElements[key] = imageElement;
});

function getPowerUpImage(name) {
    return imageElements[name];
}

module.exports = {
    getPowerUpImage
};