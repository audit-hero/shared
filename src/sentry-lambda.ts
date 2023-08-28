let projectName = "sentry project"

export let setProjectName = (name: string) => {
  projectName = name
}

export type SentryLevel = "error" | "warning" | "info" | "debug" | "fatal";

interface Input {
  dsn: string;
  event: Event;
}

interface Event {
  message: string;
  level: SentryLevel;
  tags?: Tags;
  errors?: any[] | null;
}

interface Tags {
  [key: string]: string;
}

export let sentryMessage = async (message: string, level: SentryLevel = "info") => {
  let event: Input = {
    dsn: process.env.SENTRY_DSN!,
    event: {
      message: message,
      level: level,
      tags: {
        module: projectName
      },
    }
  }

  await sendRequest(event)
}

export let sentryError = async (payload: any, message = payload.message) => {
  let event: Input = {
    dsn: process.env.SENTRY_DSN!,
    event: {
      message: message,
      level: "error",
      tags: {
        module: projectName
      },
      errors: [payload]
    }
  }

  await sendRequest(event)
}

let sendRequest = async (event: Input) => {
  // map the errors to name and stack only
  if (event.event.errors) {
    event.event.errors = event.event.errors.map(it => {
      return {
        type: it.name,
        path: it.stack,
        message: it.message
      }
    })
  }

  console.log(`sending message to sentry`)
  if (event.event.errors && event.event.errors.length > 0) {
    if (event.event.errors[0].path) {
      console.log(`${event.event.errors[0].path}`)
    }
  }
  else {
    console.log(`${JSON.stringify(event.event, null, 2)}`)
  }

  if (!process.env.SENTRY_DSN) {
    console.log("no sentry dsn, skipping")
    return
  }

  let json = JSON.stringify(event)
  let response = await fetch(process.env.SENTRY_URL ?? "", {
    method: "POST",
    body: json
  })

  if (!response.ok) {
    console.log(`failed to send message to sentry ${response.status} ${response.statusText} ${JSON.stringify(response.body)}}`)
  }
}

export let withSentry = async (block: () => Promise<any>): Promise<any> => {
  try {
    let result = await block()
    return result
  }
  catch (e: any) {
    await sentryError(e)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),

    }
  }
}