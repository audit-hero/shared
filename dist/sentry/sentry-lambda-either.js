import { getSentryProjectName, sentryError, setSentryProjectName, } from "./sentry.js";
export let withSentry = async (props) => {
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
            _tag: "Left",
            left: { error: e.message },
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
export let withStreamingSentry = async (props) => {
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
            _tag: "Left",
            left: { error: e.message },
        };
        stream.write(JSON.stringify(body));
        stream.end();
    }
};
export const isCorsRequest = (event) => {
    if (event?.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            body: JSON.stringify(""),
            headers: corsHeaders,
        };
    }
};
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Credentials": true,
};
//# sourceMappingURL=sentry-lambda-either.js.map