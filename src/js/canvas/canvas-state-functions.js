import forEach from "core/src/core/util/for-each.js";

function getActiveEffects(gameState, renderTime) {
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
    return activeEffects;
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

function createState({pathSegmentRenderData = {}} = {}) {
    return {
        renderers: [],
        prevRenderTime: 0,
        overlay: undefined,
        requestId: undefined,
        pathSegmentRenderData
    }
}

export {
    clearPathSegmentRenderData,
    createState,
    getActiveEffects,
    getPathSegmentRenderData
}
