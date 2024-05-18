import { it } from "vitest";
import { withSentryE } from "./sentry.js";
it("withSentryE", () => {
    let handler = withSentryE({
        name: "test",
        handler: async (event) => {
            return { statusCode: 200, body: "hello" };
        },
    });
    handler({
        headers: {},
        body: "test",
    });
});
//# sourceMappingURL=sentry-lambda.test.js.map