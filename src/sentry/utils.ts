import { isInAWS } from "../lambda-stream/index.js"

export let getAwslambda = () => {
  let lambda
  if (isInAWS()) {
    //@ts-ignore
    lambda = awslambda
  } else {
    // local
    lambda = {
      HttpResponseStream: {
        from: (stream: any, response: any) => ({
          write: (data: any) => {
            stream.write(data)
          },
          end: () => {
            stream.end()
          },
        }),
      },
    }
  }
  return lambda
}
