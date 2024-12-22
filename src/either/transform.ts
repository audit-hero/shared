import { SimpleError } from "../types.js"
import { ApiLeft, ApiRight, FpTsEither as Either } from "./either.js"

/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export let fromApiEither = <A>(e: ApiLeft<string> | ApiRight<A>): Either<Error, A> => {
  if (!e.status)
    return { _tag: "Left", left: new Error(`fae: No status in API response: ${getStringAny(e)}`) }

  if (e.status === "failure") {
    if (!e.reason)
      return { _tag: "Left", left: new Error(`fae: No error reason: ${getStringAny(e)}`) }

    return {
      _tag: "Left",
      left: new Error(e.reason),
    }
  }

  return {
    _tag: "Right",
    right: e.data as A,
  }
}

let getStringAny = (e: any) => {
  try {
    if (typeof e === "string") return e.slice(0, 200)
    if (typeof e === "object") return JSON.stringify(e).slice(0, 200)

    return e.toString().slice(0, 200)
  } catch (e) {
    return "unknown error"
  }
}

/**
 * Transfrom E.Either<Error, any> to API's format. Including changing Error to a string.
 *
 * Used in lambda returns
 */
export let toApiEither = <E, A>(e: Either<E, A>): ApiLeft<string> | ApiRight<A> => {
  if (e._tag === "Left") {
    let reason: string
    if (e.left instanceof Error) {
      reason = e.left.message
    } else if ((e.left as any).error && typeof (e.left as any).error === "string") {
      reason = (e.left as any).error
    } else {
      try {
        reason = `${JSON.stringify(e.left)}`
      } catch (jsonError) {
        reason = `fae: Unknown error ${e.left}`
      }
    }

    return {
      status: "failure",
      reason,
    }
  }

  return {
    status: "success",
    data: e.right,
  }
}
