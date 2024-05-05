import { withSentry, withStreamingSentry } from "./sentry-lambda.js"

let testWithSentry = async () => {
  withSentry({
    name: "test",
    handler: async () => {
      throw new Error("testing")
    },
  })
}

let testWithStreamingSentry = async () => {
  withStreamingSentry({
    name: "test-stream",
    handler: async () => {
      throw new Error("testing stream")
    },
  })
}

testWithStreamingSentry().then(() => console.log("done"))
