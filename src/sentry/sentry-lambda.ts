import {
  setSentryProjectName,
  sentryError,
  getSentryProjectName,
  isCorsRequest,
  getCorsHeaders,
} from "./sentry.js"
import { APIGatewayProxyEventV2 } from "aws-lambda"
import { streamify } from "../lambda-stream/index.js"
import { getAwslambda } from "./utils.js"
import {
  LambdaSentryProps,
  StreamingSentryProps,
  StreamingRequestHandler,
  LambdaRequestHandler,
} from "./types.js"

let lambda = getAwslambda()

export let withSentry =
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

      return {
        statusCode: 500,
        body: JSON.stringify({ error: (e as any).message }),
      }
    }
  }

/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 *
 * Also, allows local testing with lambda-stream lib
 */
export let withStreamingSentry = (
  props: StreamingSentryProps
): StreamingRequestHandler =>
  streamify(async (event, stream) => {
    const { name, handler } = props

    try {
      setSentryProjectName(name)

      let corsResponse = isCorsRequest(event)

      if (corsResponse) {
        stream = lambda.HttpResponseStream.from(stream, corsResponse)
        stream.write("")
        stream.end()
        return
      } else {
        stream = lambda.HttpResponseStream.from(stream, {
          statusCode: 200,
        })
      }

      await handler(event, stream)
    } catch (e) {
      sentryError(`Unexpected error in: ${getSentryProjectName()}`, e)

      stream = lambda.HttpResponseStream.from(stream, {
        statusCode: 500,
      })

      stream.write((e as any).message)
      stream.end()
    }
  })
