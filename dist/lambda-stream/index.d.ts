import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda";
import { ResponseStream } from "./ResponseStream.js";
export declare function isInAWS(): boolean;
export type RequestHandler = (ev: APIGatewayProxyEventV2, streamResponse: ResponseStream, ctx?: Context, callback?: Callback) => any | Promise<any>;
export declare function streamify(handler: RequestHandler): RequestHandler;
