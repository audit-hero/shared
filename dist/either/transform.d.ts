import { SimpleError } from "../types.js";
import { ApiLeft, ApiRight, FpTsEither as Either } from "./either.js";
/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export declare let fromApiEither: <A>(e: ApiLeft<SimpleError> | ApiRight<A>) => Either<Error, A>;
/**
 * Transfrom E.Either<Error, any> to API's format. Including changing Error to SimpleError.
 *
 * Used in lambda returns
 */
export declare let toApiEither: <E, A>(e: Either<E, A>) => ApiLeft<SimpleError> | ApiRight<A>;
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
export declare let fetchTE: <A>(input: RequestInfo | URL, init?: RequestInit | undefined) => () => Promise<Either<Error, A>>;
/**
 * We either stream chat response as string + return it as E.right in the end, or return the error
 * as E.left
 *
 * 1
 *
 * @param stream - here we stream the E.right content as string before returning the E.right in the
 * end as well.
 * @param options.removeCodeBlock - if true, we trim the stream content between the first ```
 */
export declare let fetchTEStream: (input: RequestInfo | URL, init: RequestInit | undefined, stream: (chunk: string) => void) => (() => Promise<Either<Error, string>>);
