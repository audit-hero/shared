import { SimpleError } from "../types.js"
import { ApiLeft, ApiRight, FpTsEither as Either } from "./either.js"

/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export let fromApiEither = <A>(e: ApiLeft<SimpleError> | ApiRight<A>): Either<Error, A> => {
  if (!e.type) return { _tag: "Left", left: new Error("Invalid API response") }

  if (e.type === "left") {
    if (!e.left?.error) return { _tag: "Left", left: new Error("Invalid API response") }

    return {
      _tag: "Left",
      left: new Error(e.left.error),
    }
  }

  if (!e.right) return { _tag: "Left", left: new Error("Invalid API response") }

  return {
    _tag: "Right",
    right: e.right,
  }
}

/**
 * Transfrom E.Either<Error, any> to API's format. Including changing Error to SimpleError.
 *
 * Used in lambda returns
 */
export let toApiEither = <E, A>(e: Either<E, A>): ApiLeft<SimpleError> | ApiRight<A> => {
  if (e._tag === "Left") {
    let simpleError: SimpleError
    if (e.left instanceof Error) {
      simpleError = { error: e.left.message }
    } else if ((e.left as any).error && typeof (e.left as any).error === "string") {
      simpleError = { error: (e.left as any).error }
    } else {
      try {
        simpleError = { error: `${JSON.stringify(e.left)}` }
      } catch (jsonError) {
        simpleError = { error: `Unknown error ${e.left}` }
      }
    }

    return {
      type: "left",
      left: simpleError,
    }
  }

  return {
    type: "right",
    right: e.right,
  }
}

