import { setSentryProjectName, sentryError, getSentryProjectName, isCorsRequest, } from "./sentry.js";
import { streamify } from "../lambda-stream/index.js";
import { getAwslambda } from "./utils.js";
let lambda = getAwslambda();
export let withSentry = (props) => async (event) => {
    let { name, handler } = props;
    try {
        setSentryProjectName(name);
        let corsResponse = isCorsRequest(event);
        if (corsResponse) {
            return corsResponse;
        }
        return await handler(event);
    }
    catch (e) {
        sentryError(`Unexpected error in: ${getSentryProjectName()}`, e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
};
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 *
 * Also, allows local testing with lambda-stream lib
 */
export let withStreamingSentry = (props) => streamify(async (event, stream) => {
    const { name, handler } = props;
    try {
        setSentryProjectName(name);
        let corsResponse = isCorsRequest(event);
        if (corsResponse) {
            stream = lambda.HttpResponseStream.from(stream, corsResponse);
            stream.write("");
            stream.end();
            return;
        }
        else {
            stream = lambda.HttpResponseStream.from(stream, {
                statusCode: 200,
            });
        }
        await handler(event, stream);
    }
    catch (e) {
        sentryError(`Unexpected error in: ${getSentryProjectName()}`, e);
        stream = lambda.HttpResponseStream.from(stream, {
            statusCode: 500,
        });
        stream.write(e.message);
        stream.end();
    }
});
//# sourceMappingURL=sentry-lambda.js.map