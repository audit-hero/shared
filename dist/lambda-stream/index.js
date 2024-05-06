import { ResponseStream } from "./ResponseStream.js";
export function isInAWS() {
    return (process.env.AWS_XRAY_DAEMON_ADDRESS !== undefined &&
        // @ts-ignore
        globalThis.awslambda !== undefined &&
        // @ts-ignore
        awslambda.streamifyResponse !== undefined);
}
export function streamify(handler) {
    // Check for global awslambda
    if (isInAWS()) {
        // @ts-ignore
        return awslambda.streamifyResponse(handler);
    }
    else {
        return new Proxy(handler, {
            apply: async function (target, _, argList) {
                const responseStream = patchArgs(argList);
                await target(...argList);
                return {
                    statusCode: 200,
                    headers: {
                        "content-type": responseStream._contentType || "application/json",
                        "Access-Control-Allow-Origin": argList[0].headers["Origin"] || "*",
                    },
                    ...(responseStream._isBase64Encoded ? { isBase64Encoded: responseStream._isBase64Encoded } : {}),
                    body: responseStream._isBase64Encoded
                        ? responseStream.getBufferedData().toString("base64")
                        : responseStream.getBufferedData().toString()
                };
            }
        });
    }
}
function patchArgs(argList) {
    if (!(argList[1] instanceof ResponseStream)) {
        const responseStream = new ResponseStream();
        argList.splice(1, 0, responseStream);
    }
    return argList[1];
}
export { ResponseStream } from "./ResponseStream.js";
//# sourceMappingURL=index.js.map