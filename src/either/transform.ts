import { ApiLeft, ApiRight, FpTsEither } from "./either.js"

export let apiEitherToFpTsEither = <E, A>(
  e: ApiLeft<E> | ApiRight<A>
): FpTsEither<E, A> => {
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
  e: FpTsEither<E, A>
): ApiLeft<E> | ApiRight<A> => {
  if (e._tag === "Left") {
    return {
      type: "left",
      left: e.left,
    }
  }

  return {
    type: "right",
    right: e.right,
  }
}

export let toApiEither = <E, A>(e: FpTsEither<E, A>): string =>
  JSON.stringify(toApiEither(e))

export let fromApiEither = <E, A>(s: string): FpTsEither<E, A> =>
  apiEitherToFpTsEither(JSON.parse(s))
