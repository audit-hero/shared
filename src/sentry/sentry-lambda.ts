import {
  setSentryProjectName,
  sentryError,
  getSentryProjectName,
  isCorsRequest,
} from "./sentry.js"

//@ts-ignore
let lambda = awslambda

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
      stream = lambda.HttpResponseStream.from(stream, corsResponse)
      stream.write("")
      stream.end()
      return
    } else {
      stream = lambda.HttpResponseStream.from(stream, {
        statusCode: 200,
      })
    }

    await block()
  } catch (e) {
    sentryError(`Unexpected error in: ${getSentryProjectName()}`, e)

    stream = lambda.HttpResponseStream.from(stream, {
      statusCode: 500,
    })

    stream.write((e as any).message)
    stream.end()
  }
}
