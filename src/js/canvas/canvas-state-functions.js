import forEach from "core/src/core/util/for-each.js";

function getActiveEffects(gameState, renderTime, {wormId, effectName} = {}) {
    var activeEffects = [];
    var effectEvents = gameState.effectEvents;
    for (var i = 0; i <effectEvents.length && effectEvents[i].time <= renderTime; i++) {
        var effectEvent = effectEvents[i];
        if (effectEvent.type === "spawn") {
            activeEffects.push(effectEvent.effect);
        } else if (effectEvent.type === "despawn") {
            activeEffects = activeEffects.filter(activeEffect => (activeEffect.id !== effectEvent.effectId));
        } else {
            throw Error("Unknown effect event type: " + effectEvent.type);
        }
    }

    if(wormId !== undefined) {
        activeEffects =  activeEffects.filter(effect => effect.wormId === wormId);
    }

    if(effectEvent !== undefined) {
        activeEffects = activeEffects.filter(effect => effect.name === effectName);
    }
    return activeEffects
}

function getActiveSpawnEffectEvents(gameState, renderTime, {wormId, effectName} = {}) {
    var activeEffectEvents = [];
    var effectEvents = gameState.effectEvents;
    for (var i = 0; i <effectEvents.length && effectEvents[i].time <= renderTime; i++) {
        var effectEvent = effectEvents[i];
        if (effectEvent.type === "spawn") {
            activeEffectEvents.push(effectEvent);
        } else if (effectEvent.type === "despawn") {
            activeEffectEvents = activeEffectEvents.filter(activeEffectEvent => (activeEffectEvent.effect.id !== effectEvent.effectId));
        } else {
            throw Error("Unknown effect event type: " + effectEvent.type);
        }
    }

    if(wormId !== undefined) {
        activeEffectEvents = activeEffectEvents.filter(effectEvent => effectEvent.effect.wormId === wormId);
    }

    if(effectEvent !== undefined) {
        activeEffectEvents = activeEffectEvents.filter(effectEvent => effectEvent.effect.name === effectName);
    }

    return activeEffectEvents
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
        var activeWallHackSpawnEffectEvents = getActiveSpawnEffectEvents(gameState, time, {wormId, effectName: "wall_hack"});
        if(activeWallHackSpawnEffectEvents.length === 0) {
            return null;
        }
        var startingTime = activeWallHackSpawnEffectEvents[0].time;
        if(startingTime === currentStartTime) {
            return currentStartTime;
        }
        var earlierStartingTime = getWallHackStartingTime(startingTime, startingTime);
        return earlierStartingTime === null ? startingTime : earlierStartingTime;
    }

    return getWallHackStartingTime(renderTime, renderTime);
}

export {
    clearPathSegmentRenderData,
    createState,
    getActiveEffects,
    getActiveSpawnEffectEvents,
    getPathSegmentRenderData,
    getWormBlinkingStartTime,
    getWormRenderData,
}
