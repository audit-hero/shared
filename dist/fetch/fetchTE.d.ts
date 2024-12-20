import { FpTsEither as Either } from "../either/either.js";
/**
 * WIP
 *
 * Backend returns Either<Error, A> as string. Here, we convert it to TaskEither<Error, A>. You need
 * to chain this function in order to enable correct error conversion and bubbling.
 *
 *
 * use this after getting text from fetch
 *
 * () => TE.TaskEither<Error, string>,
 * TE.chain(fromApiEitherTE)
 * TE.map((it)=> it as MyObject)
 */
export declare let fromApiEitherTE: <A>(s: string) => () => Promise<Either<Error, A>>;
/**
 * Calls the fetch, parses response with fromApiEither, and returns a TE.TaskEither<Error, A>
 */
export declare let fetchTE: <A>(input: RequestInfo | URL, init?: RequestInit | undefined) => () => Promise<Either<Error, A>>;
/**
 * We either stream chat response as string + return it as E.right in the end, or return the error
 * as E.left.
 *
 * @param stream - Here, we stream the E.right content as string before returning the E.right in the
 * end as well.
 * @param initProgress - Here, we stream the pre response dot progress (eg on auth success, etc, before the real answer)
 */
export declare let fetchTEStream: (input: RequestInfo | URL, init: RequestInit | undefined, stream: (chunk: string) => void, initProgress?: () => void) => (() => Promise<Either<Error, string>>);
export { ResponseStream } from "../lambda-stream/ResponseStream.js";
