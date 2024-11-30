import { FpTsEither } from "../either/either.js"
import { fromApiEither } from "../either/transform.js"

/**
 * For API-s that have dot loading before returning a JSON object.
 */
export let fetchWithDotProgress = async <Output>(
  request: Promise<Response>,
  progress: (progress: string) => void,
): Promise<FpTsEither<Error, Output>> => {
  let decoder = new TextDecoder("utf-8")
  let stream = ""
  let progressStr = ""

  let result: FpTsEither<Error, Output> = await request
    .then((r) => r.body)
    .then((body) =>
      body?.pipeTo(
        new WritableStream({
          write: (chunk) => {
            let str = decoder.decode(chunk)
            let progressEnded = stream === "" && str.match(/(\{|\[).*/)

            if (stream === "") {
              if (!progressEnded) {
                progressStr += str
                progress(progressStr)
              } else {
                progress("")
                stream += str.match(/(\{|\[).*/)?.[0] || ""
              }
            } else {
              progress(str)
              stream += str
            }
          },
        }),
      ),
    )
    .then(() => {
      let response = fromApiEither<Output>(JSON.parse(stream))
      return response
    })
    .catch((err: any) => {
      let error = `error streaming finding ${err.message}`
      return { _tag: "Left", left: new Error(error) } as FpTsEither<Error, Output>
    })

  return result
}
