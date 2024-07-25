import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { isInAWS } from "../lambda-stream/index.js"

export const isCorsRequest = (event: APIGatewayProxyEventV2) => {
  if ((event as any)?.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: JSON.stringify(""),
      headers: getCorsHeaders(event),
    }
  }
}

export let addCorsHeaders =
  (event: APIGatewayProxyEventV2) =>
  (response: APIGatewayProxyResultV2 | void): APIGatewayProxyResultV2 | void => {
    if (isInAWS()) return response

    if (typeof response === "string") {
      return {
        body: response,
        statusCode: 200,
        headers: getCorsHeaders({}),
      }
    } else if (typeof response === "object") {
      return {
        ...response,
        headers: {
          ...(response.headers || {}),
          ...getCorsHeaders(event),
        },
      }
    }

    return response
  }

export let getCorsHeaders = (event: any) => {
  let headers = event.headers || {}
  let origin = headers["Origin"] || headers["origin"] || "*"

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Credentials": true,
  }
}
