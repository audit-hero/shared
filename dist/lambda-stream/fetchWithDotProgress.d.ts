import { FpTsEither } from "../either/either.js";
/**
 * For API-s that have dot loading before returning a JSON object.
 */
export declare let fetchWithDotProgress: <Output>(request: Promise<Response>, progress: (progress: string) => void) => Promise<FpTsEither<Error, Output>>;
