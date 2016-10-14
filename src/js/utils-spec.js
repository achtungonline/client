import * as utils from "./utils.js";

describe("client utils", () => {
    it("rgbToHex", function () {
        expect(utils.rgbToHex([0,0,0])).toEqual("#000000");
        expect(utils.rgbToHex([255,255,255])).toEqual("#ffffff");
    });
});
