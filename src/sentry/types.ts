import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Callback,
  Context,
} from "aws-lambda"
import { ResponseStream } from "../lambda-stream/ResponseStream.js"

export type LambdaSentryProps = {
  name: string
  handler: LambdaRequestHandler
}

// For lambdas, we should return the object. It will be converted to body string in aws
export type LambdaRequestHandler = (ev: APIGatewayProxyEventV2) => Promise<void | any>

export type StreamingSentryProps = {
  name: string
  handler: StreamingRequestHandler
}
// For streaming, we should return status code in the end
export type StreamingRequestHandler = (
  ev: APIGatewayProxyEventV2,
  streamResponse: ResponseStream,
  ctx?: Context,
  callback?: Callback,
) => Promise<APIGatewayProxyStructuredResultV2>
