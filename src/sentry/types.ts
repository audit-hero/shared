import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyStructuredResultV2,
  Callback,
  Context,
} from "aws-lambda"
import { ResponseStream } from "../lambda-stream/ResponseStream.js"

export type LambdaSentryProps = {
  name: string
  handler: LambdaRequestHandler
}

export type LambdaRequestHandler = (
  ev: APIGatewayProxyEventV2
) => Promise<APIGatewayProxyResultV2>

export type StreamingSentryProps = {
  name: string
  handler: StreamingRequestHandler
}

export type StreamingRequestHandler = (
  ev: APIGatewayProxyEventV2,
  streamResponse: ResponseStream,
  ctx?: Context,
  callback?: Callback
) => Promise<APIGatewayProxyStructuredResultV2>
