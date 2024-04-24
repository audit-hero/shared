import {
  getSentryProjectName,
  sentryError,
  setSentryProjectName,
} from "./sentry-lambda.js"
import { SimpleError } from "./types.js"

// We always return 200 if user reaches our service, but 
//  {_tag: Right, right: A} if there is no error
//  {_tag: Left, left: {code?:number, error: string}} if there is a handled error
// User still needs to check for 404 or 500 errors

export interface Left<E> {
  readonly _tag: "Left"
  readonly left: E
}

export interface Right<A> {
  readonly _tag: "Right"
  readonly right: A
}

export let withSentry = async (props: {
  name: string
  event: any
  block: (event: any) => Promise<any>
}): Promise<any> => {
  let { name, event, block } = props

  try {
    setSentryProjectName(name)

    let corsResponse = isCorsRequest(event)

    if (corsResponse) {
      return corsResponse
    }

    return await block(event)
  } catch (e) {
    sentryError(`Unexpected error in: ${getSentryProjectName()}`, e)

    let body: Left<SimpleError> = {
      _tag: "Left",
      left: { error: (e as any).message },
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
export let withStreamingSentry = async (props: {
  name: string
  event: any
  stream: any
  block: () => Promise<any>
}): Promise<any> => {
  let { name, event, stream, block } = props

  try {
    setSentryProjectName(name)

    let corsResponse = isCorsRequest(event)

    if (corsResponse) {
      stream.end()
      return corsResponse
    }

    return await block()
  } catch (e) {
    sentryError(`Unexpected error in: ${getSentryProjectName()}`, e)

    let body: Left<SimpleError> = {
      _tag: "Left",
      left: { error: (e as any).message },
    }

    stream.write(JSON.stringify(body))
    stream.end()
  }
}

export const isCorsRequest = (event: any) => {
  if (event?.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: JSON.stringify(""),
      headers: corsHeaders,
    }
  }
}
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Credentials": true,
}
