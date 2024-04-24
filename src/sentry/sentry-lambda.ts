import {
  setSentryProjectName,
  sentryError,
  getSentryProjectName,
} from "./sentry.js"

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

    return {
      statusCode: 500,
      body: JSON.stringify({ error: (e as any).message }),
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
    stream.write((e as any).message)
    stream.end()

    return {
      statusCode: 500,
      body: JSON.stringify({ error: (e as any).message }),
    }
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
