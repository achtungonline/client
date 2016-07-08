module.exports = function Animator() {
    var animations = [];

    /*
     * Required fields:
     *  {item, property, change, startTime, duration}
     * Optional fields:
     *  {endCallback, changeFunction(not implemented)}
     */
    function startAnimation(animation) {
        animation.endTime = animation.startTime + animation.duration;
        animations.push(animation);
    }

    function update(updateStartTime, updateEndTime) {
        for (var i = 0; i < animations.length; i++) {
            var animation = animations[i];
            var clampedStartTime = Math.min(Math.max(updateStartTime, animation.startTime), animation.endTime);
            var clampedEndTime = Math.min(Math.max(updateEndTime, animation.startTime), animation.endTime);
            var deltaTime = clampedEndTime - clampedStartTime;
            var deltaChange = deltaTime / animation.duration;
            animation.item[animation.property] += animation.change * deltaChange;
            if (updateEndTime < animation.startTime || updateEndTime >= animation.endTime) {
                animations.splice(i, 1);
                i--;
            }
            if (updateEndTime >= animation.endTime && animation.endCallback !== undefined) {
                animation.endCallback();
            }
        }
    }

    return {
        startAnimation: startAnimation,
        update: update
    };
};
