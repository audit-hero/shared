import { ApiLeft, ApiRight, FpTsEither as Either } from "./either.js";
/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export declare let fromApiEither: <A>(e: ApiLeft<string> | ApiRight<A>) => Either<Error, A>;
/**
 * Transfrom E.Either<Error, any> to API's format. Including changing Error to a string.
 *
 * Used in lambda returns
 */
export declare let toApiEither: <E, A>(e: Either<E, A>) => ApiLeft<string> | ApiRight<A>;
