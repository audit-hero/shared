import { setSentryProjectName, sentryError, getSentryProjectName, isCorsRequest, } from "./sentry.js";
//@ts-ignore
let awslambda = awslambda;
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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
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
            stream = awslambda.HttpResponseStream.from(stream, corsResponse);
            stream.write("");
            stream.end();
            return;
        }
        else {
            stream = awslambda.HttpResponseStream.from(stream, {
                statusCode: 200,
            });
        }
        await block();
    }
    catch (e) {
        sentryError(`Unexpected error in: ${getSentryProjectName()}`, e);
        stream = awslambda.HttpResponseStream.from(stream, {
            statusCode: 500,
        });
        stream.write(e.message);
        stream.end();
    }
};
//# sourceMappingURL=sentry-lambda.js.map