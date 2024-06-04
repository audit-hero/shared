import { APIGatewayProxyEventV2 } from "aws-lambda"
import {
  getCorsHeaders,
  getSentryProjectName,
  isCorsRequest,
  sentryError,
  setSentryProjectName,
} from "./sentry.js"
import {
  LambdaRequestHandler,
  LambdaSentryProps,
  StreamingRequestHandler,
  StreamingSentryProps,
} from "./types.js"
import { streamify } from "../lambda-stream/index.js"

type SimpleError = {
  code?: number
  error: string
}

type ApiLeft<T> = {
  type: "left"
  left: T
}

// We always return 200 if user reaches our service, but
//  {type: "right", right: A} if there is no error
//  {type: "left", left: {code?:number, error: string}} if there is a handled error

// why use this logic?
//  - Users don't have to think about HTTP status codes, they just have to check whether the response
//      type is a right or left.
//  - We don't have to think about which status codes to use. Generally, error string is enough
//  ~~- In lambda streaming, you cannot test status codes locally~~

export let withSentryE =
  (props: LambdaSentryProps): LambdaRequestHandler =>
  async (event: APIGatewayProxyEventV2) => {
    let { name, handler } = props

    try {
      setSentryProjectName(name)

      let corsResponse = isCorsRequest(event)

      if (corsResponse) {
        return corsResponse
      }

      return await handler(event).then((response: any) => {
        return {
          ...response,
          headers: {
            ...response.headers,
            ...getCorsHeaders(event),
          },
        }
      })
    } catch (e) {
      sentryError(`Unexpected error in: ${getSentryProjectName()}`, e)

      let body: ApiLeft<SimpleError> = {
        type: "left",
        left: {
          code: 500,
          error: (e as any).message,
        },
      }

      return {
        statusCode: 200,
        body: JSON.stringify(body),
      }
    }
  }

/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 */
export let withStreamingSentryE = (
  props: StreamingSentryProps
): StreamingRequestHandler =>
  streamify(async (event, stream) => {
    const { name, handler } = props

    try {
      setSentryProjectName(name)

      let corsResponse = isCorsRequest(event)

      if (corsResponse) {
        stream.end()
        return corsResponse
      }

      return await handler(event, stream)
    } catch (e) {
      sentryError(`Unexpected error in: ${getSentryProjectName()}`, e)

      let body: ApiLeft<SimpleError> = {
        type: "left",
        left: {
          code: 500,
          error: (e as any).message,
        },
      }

      stream.write(JSON.stringify(body))
      stream.end()
    }
  })
