import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda"
import { ResponseStream } from "../lambda-stream/ResponseStream.js"

export type LambdaSentryProps = {
  name: string
  handler: LambdaRequestHandler
}

export type LambdaRequestHandler = (
  ev: APIGatewayProxyEventV2
) => any | Promise<any>

export type StreamingSentryProps = {
  name: string
  handler: StreamingRequestHandler
}

export type StreamingRequestHandler = (
  ev: APIGatewayProxyEventV2,
  streamResponse: ResponseStream,
  ctx?: Context,
  callback?: Callback
) => any | Promise<any>
