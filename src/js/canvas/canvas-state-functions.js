import forEach from "core/src/core/util/for-each.js";
import * as gsf from "core/src/core/game-state-functions.js";


function getActiveEffects(gameState, renderTime, {wormId, effectName} = {}) {
    var activeEffects = [];
    var effectEvents = gameState.effectEvents;
    for (var i = 0; i < effectEvents.length && effectEvents[i].time <= renderTime; i++) {
        var effectEvent = effectEvents[i];
        if (effectEvent.type === "spawn") {
            activeEffects.push(effectEvent.effect);
        } else if (effectEvent.type === "despawn") {
            activeEffects = activeEffects.filter(activeEffect => (activeEffect.id !== effectEvent.effectId));
        } else {
            throw Error("Unknown effect event type: " + effectEvent.type);
        }
    }

    if (wormId !== undefined) {
        activeEffects = activeEffects.filter(effect => effect.wormId === wormId);
    }

    if (effectEvent !== undefined) {
        activeEffects = activeEffects.filter(effect => effect.name === effectName);
    }
    return activeEffects
}

function getEffects(gameState, {wormId, effectName} = {}) {
    return gameState.effectEvents.filter(function (ee) {
        return (ee.type === "spawn") &&
            (!effectName || ee.effect.name === effectName) &&
            (!wormId || ee.effect.wormId === wormId)
    }).map(function (ee) {
        return ee.effect
    });
}

function clearPathSegmentRenderData(canvasState) {
    forEach(canvasState.pathSegmentRenderData, function (renderData) {
        renderData.segmentIndex = 0;
        renderData.latestClearSegmentIndex = 0;
    });
}

function getPathSegmentRenderData(canvasState, pathSegmentId) {
    if (!canvasState.pathSegmentRenderData[pathSegmentId]) {
        canvasState.pathSegmentRenderData[pathSegmentId] = {
            segmentIndex: 0
        };
    }
    return canvasState.pathSegmentRenderData[pathSegmentId];
}

function getWormRenderData(canvasState, wormId) {
    if (!canvasState.wormRenderData[wormId]) {
        canvasState.wormRenderData[wormId] = {
            blinkingStartTimer: 0
        };
    }
    return canvasState.pathSegmentRenderData[wormId];
}

function createState({pathSegmentRenderData = {}} = {}) {
    return {
        renderers: [],
        prevRenderTime: 0,
        overlay: undefined,
        requestId: undefined,
        pathSegmentRenderData,
        wormRenderData: {}
    }
}


function getWormBlinkingStartTime(gameState, wormId, renderTime) {
    function getWallHackStartingTime(time, currentStartTime) {
        var activeWallHackEffects = getActiveEffects(gameState, time, {wormId, effectName: "wall_hack"});
        if (activeWallHackEffects.length === 0) {
            return null;
        }
        var startingTime = activeWallHackEffects[0].time;
        if (startingTime === currentStartTime) {
            return currentStartTime;
        }
        var earlierStartingTime = getWallHackStartingTime(startingTime, startingTime);
        return earlierStartingTime === null ? startingTime : earlierStartingTime;
    }

    return getWallHackStartingTime(renderTime, renderTime);
}

function getDrunkBubbles(gameState, time, segmentId, wormId) {
    var bubbles = [];
    var spawnFrequency = 0.2;
    var bubbleTimeSpan = 1;
    var bubbleRise = 40;
    var drunkEffects = getEffects(gameState, {wormId, effectName: "drunk"});
    drunkEffects.forEach(function (e) {
        for (var bubbleStartTime = e.time; bubbleStartTime < e.time + e.timeLeft; bubbleStartTime += spawnFrequency) {
            var timeDiff = time - bubbleStartTime;
            if ((timeDiff < bubbleTimeSpan && bubbleStartTime < time)) {
                var position = gsf.getWormPathSegmentPositionAtTime(gameState, segmentId, bubbleStartTime);
                var fakeRandomRadius = ((bubbleStartTime % 0.157) * 40)+ 2;
                var fakeRandomRise =  (bubbleRise * (timeDiff / bubbleTimeSpan)) * (((bubbleStartTime % 0.141) / (0.141 * 2)) + 0.5);
                if(position) {
                    bubbles.push({
                        x: position.x,
                        y: position.y - fakeRandomRise,
                        radius: fakeRandomRadius
                    })
                }
            }
        }
    });
    return bubbles;
}

export {
    clearPathSegmentRenderData,
    createState,
    getActiveEffects,
    getDrunkBubbles,
    getPathSegmentRenderData,
    getWormBlinkingStartTime,
    getWormRenderData,
}
