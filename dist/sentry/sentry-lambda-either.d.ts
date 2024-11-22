import { LambdaRequestHandler, LambdaSentryProps, StreamingRequestHandler, StreamingSentryProps } from "./types.js";
export declare let withSentryE: (props: LambdaSentryProps) => LambdaRequestHandler;
/**
 *
 * Sets sentry project name, answers cors requests, and sends uncaught error to sentry if it occurs
 *
 * Notes:
 *  - Don't stream the string and write it again in the end of the function. You will have double strings.
 *  - Don't stream ... before calling the chat. If there is an error, you cannot parse it from JSON.
 *  - Stream the string response for a successful response, but stream E.Left for a failed one.
 *
 * Client's (`fetchTEStream`) handles the conversion from string to E.right if necessary, and uses E.left for an error.
 *
 * @example
 *
 * export const handler = withStreamingSentryE({
 *   name: "my-lambda",
 *   handler: async (event, stream) => {
 *     await pipe(
 *       TE.Do,
 *       TE.chain(() => verifyAuthTE(event)),
 *       TE.chain(({jwt}) => runConvert(event, jwt, stream)),
 *       TE.tapError((err) => {
 *         stream.write(JSON.stringify(toApiEither(E.left(err))))
 *         Logger.error(`Got error: ${err}`)
 *         return TE.of(0)
 *       }),
 *     )()
 *
 *     stream.end()
 *   }
 * })
 *
 */
export declare let withStreamingSentryE: (props: StreamingSentryProps) => StreamingRequestHandler;
