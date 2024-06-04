export const isCorsRequest = (event: any) => {
  if (event?.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: JSON.stringify(""),
      headers: getCorsHeaders(event),
    }
  }
}

export let getCorsHeaders = (event: any) => {
  let headers = event.headers || {}
  let origin = headers["Origin"] || headers["origin"] || "*"
  
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Credentials": true,
  }
}
