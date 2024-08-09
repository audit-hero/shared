import { SimpleError } from "../types.js"
import { ApiLeft, ApiRight, FpTsEither } from "./either.js"

export let apiEitherToFpTsEither = <E, A>(e: ApiLeft<E> | ApiRight<A>): FpTsEither<E, A> => {
  if (e.type === "left") {
    return {
      _tag: "Left",
      left: e.left,
    }
  }

  return {
    _tag: "Right",
    right: e.right,
  }
}

export let fpTsEitherToApiEither = <E, A>(
  e: FpTsEither<E, A>,
): ApiLeft<SimpleError> | ApiRight<A> => {
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

export let toApiEither = <E, A>(e: FpTsEither<SimpleError, A>): string =>
  JSON.stringify(fpTsEitherToApiEither(e))

export let fromApiEither = <E, A>(s: string): FpTsEither<E, A> =>
  apiEitherToFpTsEither(JSON.parse(s))
