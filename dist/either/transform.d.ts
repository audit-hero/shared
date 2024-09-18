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
