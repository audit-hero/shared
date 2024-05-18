import { LambdaRequestHandler, LambdaSentryProps, StreamingRequestHandler, StreamingSentryProps } from "./types.js";
export declare let withSentryE: (props: LambdaSentryProps) => LambdaRequestHandler;
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 */
export declare let withStreamingSentryE: (props: StreamingSentryProps) => StreamingRequestHandler;
