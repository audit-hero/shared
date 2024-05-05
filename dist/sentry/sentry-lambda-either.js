import { getSentryProjectName, isCorsRequest, sentryError, setSentryProjectName, } from "./sentry.js";
import { streamify } from "../lambda-stream/index.js";
// We always return 200 if user reaches our service, but
//  {type: "right", right: A} if there is no error
//  {type: "left", left: {code?:number, error: string}} if there is a handled error
// why use this logic?
//  - Users don't have to think about HTTP status codes, they just have to check whether the response
//      type is a right or left.
//  - We don't have to think about which status codes to use. Generally, error string is enough
//  ~~- In lambda streaming, you cannot test status codes locally~~
export let withSentryE = async (props) => async (event) => {
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
        let body = {
            type: "left",
            left: {
                code: 500,
                error: e.message,
            },
        };
        return {
            statusCode: 200,
            body: JSON.stringify(body),
        };
    }
};
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 */
export let withStreamingSentryE = (props) => streamify(async (event, stream) => {
    const { name, handler } = props;
    try {
        setSentryProjectName(name);
        let corsResponse = isCorsRequest(event);
        if (corsResponse) {
            stream.end();
            return corsResponse;
        }
        return await handler(event, stream);
    }
    catch (e) {
        sentryError(`Unexpected error in: ${getSentryProjectName()}`, e);
        let body = {
            type: "left",
            left: {
                code: 500,
                error: e.message,
            },
        };
        stream.write(JSON.stringify(body));
        stream.end();
    }
});
//# sourceMappingURL=sentry-lambda-either.js.map