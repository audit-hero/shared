import { it, expect } from "vitest";
import { fromApiEither, toApiEither } from "./transform.js";
it("transforms failed api either", () => {
    let res = {
        _tag: "Left",
        left: new Error("error"),
    };
    let ser = JSON.stringify(toApiEither(res));
    expect(ser).toMatchInlineSnapshot(`"{"status":"failure","reason":{"error":"error"}}"`);
    let deser = fromApiEither(JSON.parse(ser));
    expect(deser._tag).toBe("Left");
});
it("transforms successful api either", () => {
    let res = {
        _tag: "Right",
        right: 5,
    };
    let ser = JSON.stringify(toApiEither(res));
    expect(ser).toMatchInlineSnapshot(`"{"status":"success","data":5}"`);
    let deser = fromApiEither(JSON.parse(ser));
    expect(deser._tag).toBe("Right");
});
//# sourceMappingURL=transform.test.js.map