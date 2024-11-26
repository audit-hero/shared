import { fromApiEither } from "../either/transform.js"
import { FpTsEither as Either } from "../either/either.js"

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

/**
 * Calls the fetch, parses response with fromApiEither, and returns a TE.TaskEither<Error, A>
 */
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
 * as E.left.
 *
 * @param stream - Here, we stream the E.right content as string before returning the E.right in the
 * end as well.
 * @param initProgress - Here, we stream the pre response dot progress (eg on auth success, etc, before the real answer)
 */
export let fetchTEStream = (
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  stream: (chunk: string) => void,
  initProgress?: () => void,
): (() => Promise<Either<Error, string>>) => {
  let decoder = new TextDecoder("utf-8")
  let fullRes = ""

  let pipeBody = (body: ReadableStream<Uint8Array> | null) =>
    body
      ?.pipeTo(
        new WritableStream({
          write: (bytes) => {
            let chunkWithDots = decoder.decode(bytes)
            let chunk = chunkWithDots

            if (fullRes === "" && chunkWithDots.match(/^\.+$/)) {
              initProgress?.()
              chunk = ""
            } else if (fullRes === "" && chunkWithDots.match(/^\.+.*/)) {
              chunk = chunkWithDots.split(/^\.+/)[1]
            }

            if (chunk !== "") {
              stream(chunk)
              fullRes += chunk
            }
          },
        }),
      )
      .then(() => {
        let response: Either<Error, string>
        let errorJson = isErrorJson(fullRes)

        if (errorJson) {
          response = fromApiEither<string>(errorJson)
        } else {
          response = { _tag: "Right", right: fullRes }
        }

        return response
      })
      .catch((err: any) => {
        let error = `fetchTEStream pipeBody error: ${err.message}`
        return { _tag: "Left", left: new Error(error) }
      })

  let resultFun: () => Promise<Either<Error, string>> = async () =>
    (await fetch(input, init)
      .then((it) => it.body)
      .then(pipeBody)
      .catch((err: any) => {
        let error = `fetchTEStream error1: ${err.message}`
        return { _tag: "Left", left: new Error(error) }
      })) as Either<Error, string>

  return resultFun
}

let isErrorJson = (chunk: string) => {
  try {
    let json = JSON.parse(chunk)
    if (!json.type || !json.left) return undefined
    return json
  } catch (err) {
    return undefined
  }
}

export { ResponseStream } from "../lambda-stream/ResponseStream.js"
