import { SimpleError } from "../types.js";
import { ApiLeft, ApiRight, FpTsEither } from "./either.js";
export declare let apiEitherToFpTsEither: <E, A>(e: ApiLeft<E> | ApiRight<A>) => FpTsEither<E, A>;
export declare let fpTsEitherToApiEither: <E, A>(e: FpTsEither<E, A>) => ApiLeft<SimpleError> | ApiRight<A>;
/**
 * Transform Error object to json format with error in `SimpleError` format. Can already input SimpleError as well.
 */
export declare let toApiEither: <E, A>(e: FpTsEither<SimpleError, A>) => string;
/**
 * Deserializes json string into to E.Either.
 */
export declare let fromApiEither: <E, A>(s: string) => FpTsEither<E, A>;
