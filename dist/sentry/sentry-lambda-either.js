import { getSentryProjectName, isCorsRequest, sentryError, setSentryProjectName, } from "./sentry.js";
// We always return 200 if user reaches our service, but
//  {_tag: Right, right: A} if there is no error
//  {_tag: Left, left: {code?:number, error: string}} if there is a handled error
// why use this logic?
//  - Users don't have to think about HTTP status codes, they just have to check whether the response
//      _tag is a right or left.
//  - We don't have to think about which status codes to use. Generally, error string is enough
//  - In lambda streaming, you cannot test status codes locally
export let withSentryE = async (props) => {
    let { name, event, block } = props;
    try {
        setSentryProjectName(name);
        let corsResponse = isCorsRequest(event);
        if (corsResponse) {
            return corsResponse;
        }
        return await block(event);
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
export let withStreamingSentryE = async (props) => {
    let { name, event, stream, block } = props;
    try {
        setSentryProjectName(name);
        let corsResponse = isCorsRequest(event);
        if (corsResponse) {
            stream.end();
            return corsResponse;
        }
        return await block();
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
};
//# sourceMappingURL=sentry-lambda-either.js.map