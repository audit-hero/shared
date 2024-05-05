import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { ResponseStream } from "./ResponseStream.js"

export function isInAWS(): boolean {
  return (
    process.env._X_AMZN_TRACE_ID !== undefined &&
    // @ts-ignore
    globalThis.awslambda !== undefined &&
    // @ts-ignore
    awslambda.streamifyResponse !== undefined
  )
}

// how can the parameter be a function if lambda calls with event, stream, context, callback?
// does js convert params to another function params if they match the signature?

export type RequestHandler = (
  ev: APIGatewayProxyEventV2,
  streamResponse: ResponseStream,
  ctx?: Context,
  callback?: Callback
) => any | Promise<any>

export function streamify(handler: RequestHandler
): RequestHandler {
  // Check for global awslambda
  if (isInAWS()) {
    // @ts-ignore
    return awslambda.streamifyResponse(handler)
  } else {
    return new Proxy(handler, {
      apply: async function (target, _, argList: Parameters<RequestHandler>) {
        const responseStream: ResponseStream = patchArgs(argList)
        await target(...argList)
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
        }
      }
    })
  }
}

function patchArgs(argList: any[]): ResponseStream {
  if (!(argList[1] instanceof ResponseStream)) {
    const responseStream = new ResponseStream()
    argList.splice(1, 0, responseStream)
  }
  return argList[1]
}

export { ResponseStream } from "./ResponseStream.js"
