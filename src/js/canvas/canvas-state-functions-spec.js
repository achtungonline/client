import * as csf from "./canvas-state-functions";

describe("canvasStateFunctions", () => {
    describe("createState", () => {
        it("Basic Creation test", () => {
            expect(csf.createState()).toEqual({
                renderers: [],
                overlay: undefined,
                requestId: undefined,
                pathSegmentRenderData: {},
                prevRenderTime: 0,
                wormRenderData: {}
            });
        });
    });

    describe("getPathSegmentRenderData", () => {
        it("Test when no data exists for a pathSegment", () => {
            var canvasState = csf.createState();
            expect(csf.getPathSegmentRenderData(canvasState, "1")).toEqual({
                segmentIndex: 0
            });
            expect(canvasState.pathSegmentRenderData).toEqual({
                "1": {
                    segmentIndex: 0
                }
            })
        });

        it("Test when data exists for a pathSegment", () => {
            expect(csf.getPathSegmentRenderData(csf.createState({pathSegmentRenderData: {"1": {segmentIndex: 5}}}), "1")).toEqual({
                segmentIndex: 5
            });
        });
    });

    describe("getActiveEffects", () => {
        it("Despawned effects should not show", () => {
            expect(csf.getActiveEffects({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: 1}},
                    {type: "spawn", time: 2, effect: {id: 2}},
                    {type: "despawn", time: 3, effectId: 2},
                    {type: "spawn", time: 11, effect: {id: 3}}]
            }, 10)).toEqual(
                [{id: 1}]
            );
        });

        it("Filter on wormId", () => {
            expect(csf.getActiveEffects({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: 1, wormId: "1"}},
                    {type: "spawn", time: 2, effect: {id: 2, wormId: "2"}}]
            }, 10, {wormId: "1"})).toEqual(
                [{id: 1, wormId: "1"}]
            );
        });

        it("Filter on effectName", () => {
            expect(csf.getActiveEffects({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: 1, name: "wall_hack"}},
                    {type: "spawn", time: 2, effect: {id: 2, name: "drunk"}}]
            }, 10, {effectName: "wall_hack"})).toEqual(
                [{id: 1, name: "wall_hack"}]
            );
        });
    });

    describe("getActiveSpawnEffectEvents", () => {
        it("Despawned effects should not show", () => {
            expect(csf.getActiveSpawnEffectEvents({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: 1}},
                    {type: "spawn", time: 2, effect: {id: 2}},
                    {type: "despawn", time: 3, effectId: 2},
                    {type: "spawn", time: 11, effect: {id: 3}}]
            }, 10)).toEqual(
                [{type: "spawn", time: 1, effect: {id: 1}}]
            );
        });

        it("Filter on wormId", () => {
            expect(csf.getActiveSpawnEffectEvents({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: 1, wormId: "1"}},
                    {type: "spawn", time: 2, effect: {id: 2, wormId: "2"}}]
            }, 10, {wormId: "1"})).toEqual(
                [{type: "spawn", time: 1, effect: {id: 1, wormId: "1"}}]
            );
        });

        it("Filter on effectName", () => {
            expect(csf.getActiveSpawnEffectEvents({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: 1, name: "wall_hack"}},
                    {type: "spawn", time: 2, effect: {id: 2, name: "drunk"}}]
            }, 10, {effectName: "wall_hack"})).toEqual(
                [{type: "spawn", time: 1, effect: {id: 1, name: "wall_hack"}}]
            );
        });
    });

    describe("getWormBlinkingStartTime", () => {
        it("Basic test", () => {
            expect(csf.getWormBlinkingStartTime({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: "1", name: "wall_hack", wormId: "w1"}}]
            }, "w1", 10)).toEqual(1)
        });

        it("Check when we have multiple old wallHack effects", () => {
            expect(csf.getWormBlinkingStartTime({
                effectEvents: [
                    {type: "spawn", time: 5, effect: {id: "3", name: "wall_hack", wormId: "w1"}},
                    {type: "despawn", time: 6, effectId: "3"},
                    {type: "spawn", time: 7, effect: {id: "2", name: "wall_hack", wormId: "w1"}},
                    {type: "spawn", time: 8, effect: {id: "1", name: "wall_hack", wormId: "w1"}},
                    {type: "despawn", time: 9, effectId: "2"}
                ]

            }, "w1", 10)).toEqual(7)
        });

        it("Check when we have no effect", () => {
            expect(csf.getWormBlinkingStartTime({
                effectEvents: []
            }, "w1", 10)).toEqual(null)
        });
    });
});
