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
export let fromApiEitherTE =
  <A>(s: string) =>
  () =>
    Promise.resolve(fromApiEither<A>(JSON.parse(s))) as Promise<Either<Error, A>>

export let fetchTE =
  <A>(input: RequestInfo | URL, init?: RequestInit | undefined) =>
  (): Promise<Either<Error, A>> =>
    fetch(input, init)
      .then((response) => response.text())
      .then((text) => fromApiEitherTE<A>(text)())
      .catch(
        (error) => Promise.resolve({ _tag: "Left", left: error }) as Promise<Either<Error, any>>,
      )

/**
 * We either stream chat response as string + return it as E.right in the end, or return the error
 * as E.left
 *
 * @param stream - here we stream the E.right content as string before returning the E.right in the
 * end as well.
 * @param options.removeCodeBlock - if true, we trim the stream content between the first ```
 */
export let fetchTEStream = (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  stream: (chunk: string) => void,
): (() => Promise<Either<Error, string>>) => {
  let decoder = new TextDecoder("utf-8")
  let fullRes = ""
  let isError = false

  let resultFun: () => Promise<Either<Error, string>> = async () =>
    (await fetch(input, init)
      .then((response) => response.body)
      .then((body) =>
        body
          ?.pipeTo(
            new WritableStream({
              write: (bytes) => {
                let chunk = decoder.decode(bytes)
                isError = fullRes === "" && chunk.match(/(\{|\[).*/) !== null

                if (fullRes === "") {
                  if (!isError) {
                    stream(chunk)
                    fullRes += chunk
                  } else {
                    stream("")
                    fullRes += chunk.match(/(\{|\[).*/)?.[0] || ""
                  }
                } else {
                  stream(chunk)
                  fullRes += chunk
                }
              },
            }),
          )
          .then(() => {
            let response: Either<Error, string>
            if (isError) {
              response = fromApiEither<string>(JSON.parse(fullRes))
            } else {
              response = { _tag: "Right", right: fullRes }
            }

            return response
          })
          .catch((err: any) => {
            let error = `error streaming finding ${err.message}`
            return { _tag: "Left", left: { error } }
          }),
      )) as Either<Error, string>

  return resultFun
}
