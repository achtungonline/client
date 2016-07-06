module.exports = function Animator() {
    var animations = [];

    /*
     * Required fields:
     *  {item, property, change, duration}
     * Optional fields:
     *  {endCallback, changeFunction(not implemented)}
     */
    function startAnimation(gameState, animation) {
        animation.startTime = gameState.gameTime;
        animation.previousUpdate = animation.startTime;
        animations.push(animation);
    }

    function update(gameState) {
        for (var i = 0; i < animations.length; i++) {
            var animation = animations[i];
            var deltaTime = Math.min(animation.startTime + animation.duration, gameState.gameTime) - animation.previousUpdate;
            var deltaChange = deltaTime / animation.duration;
            animation.item[animation.property] += animation.change * deltaChange;
            animation.previousUpdate = gameState.gameTime;
            if (animation.previousUpdate >= animation.startTime + animation.duration) {
                animations.splice(i, 1);
                i--;
                if (animation.endCallback) {
                    animation.endCallback();
                }
            }
        }
    }

    return {
        startAnimation: startAnimation,
        update: update
    };
};
