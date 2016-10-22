import * as csf from "./canvas-state-functions";

describe("canvasStateFunctions", () => {
    describe("createState", () => {
        it("Basic Creation test", () => {
            expect(csf.createState()).toEqual({
                renderers: [],
                overlay: undefined,
                requestId: undefined,
                pathSegmentRenderData: {},
                prevRenderTime: 0
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
    });
});
