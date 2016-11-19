import * as csf from "./canvas-state-functions";
import * as sf from "./canvas-state-functions";

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

    describe("clearPathSegmentRenderData", () => {
        it("Clear the path segment", () => {
            var canvasState = {pathSegmentRenderData: {"1": {segmentIndex: 5, latestClearSegmentIndex: 3}}};
            csf.clearPathSegmentRenderData(canvasState);
            expect(canvasState).toEqual(
                {pathSegmentRenderData: {"1": {segmentIndex: 0, latestClearSegmentIndex: -1}}});
        });
    });

    describe("getPathSegmentRenderData", () => {
        it("Test when no data exists for a pathSegment", () => {
            var canvasState = csf.createState();
            expect(csf.getPathSegmentRenderData(canvasState, "1")).toEqual({
                segmentIndex: 0,
                latestClearSegmentIndex: -1
            });
            expect(canvasState.pathSegmentRenderData).toEqual({
                "1": {
                    segmentIndex: 0,
                    latestClearSegmentIndex: -1
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


    describe("getWormBlinkingStartTime", () => {
        it("Basic test", () => {
            expect(csf.getWormBlinkingStartTime({
                effectEvents: [
                    {type: "spawn", time: 1, effect: {id: "1", name: "wall_hack", wormId: "w1", time: 1}}]
            }, "w1", 10)).toEqual(1)
        });

        it("Check when we have multiple old wallHack effects", () => {
            expect(csf.getWormBlinkingStartTime({
                effectEvents: [
                    {type: "spawn", time: 5, effect: {id: "3", name: "wall_hack", wormId: "w1", time: 5}},
                    {type: "despawn", time: 6, effectId: "3"},
                    {type: "spawn", time: 7, effect: {id: "2", name: "wall_hack", wormId: "w1", time: 7}},
                    {type: "spawn", time: 8, effect: {id: "1", name: "wall_hack", wormId: "w1", time: 8}},
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

    describe("getWormHeadToRender", () => {
        it("Worm is alive. Should render head.", () => {
            expect(csf.getWormHeadToRender(csf.createState(
                {pathSegmentRenderData: {"1": {segmentIndex: 0}}}),
                {wormPathSegments: {"1": [{startTime: 0, endTime: 5}]}},
                1,
                5)
            ).toEqual({startTime: 0, endTime: 5});
        });

        it("When worm has died. Should still render Head", () => {
            expect(csf.getWormHeadToRender(csf.createState(
                {pathSegmentRenderData: {"1": {segmentIndex: 0, latestClearSegmentIndex: -1}}}),
                {wormPathSegments: {"1": [{startTime: 0, endTime: 5}, {startTime: 5, endTime: 5, type: "worm_died"}]}},
                1,
                10)
            ).toEqual({startTime: 5, endTime: 5, type: "worm_died"});
        });

        it("When wormPathSegment has ended, but worm has not died. For example at switcharoonie. Should not render any head", () => {
            expect(csf.getWormHeadToRender(csf.createState(
                {pathSegmentRenderData: {"1": {segmentIndex: 0, latestClearSegmentIndex: -1}}}),
                {wormPathSegments: {"1": [{startTime: 0, endTime: 5}]}},
                1,
                10)
            ).toEqual(null);
        });

        it("When worm has died and map has been cleared. Should not render head any longer.", () => {
            expect(csf.getWormHeadToRender(csf.createState(
                {pathSegmentRenderData: {"1": {segmentIndex: 2, latestClearSegmentIndex: 2 }}}),
                {wormPathSegments: {"1": [{startTime: 0, endTime: 5}, {startTime: 5, endTime: 5, type: "worm_died"}, {startTime: 7, endTime: 7, type: "clear"}]}},
                1,
                10)
            ).toEqual(null);
        });

        it("We are rendering before worm exists. Should not render head.", () => {
            expect(csf.getWormHeadToRender(csf.createState(
                {pathSegmentRenderData: {"1": {segmentIndex: 0, latestClearSegmentIndex: -1}}}),
                {wormPathSegments: {"1": [{startTime: 5, endTime: 5, type: "worm_died"}]}},
                1,
                3)
            ).toEqual(null);
        });
    });
});
