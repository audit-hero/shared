import { it, expect } from "vitest"
import { FpTsEither } from "./either.js"
import { fetchTEStream, fromApiEither, toApiEither } from "./transform.js"

it("transforms failed api either", () => {
  let res: FpTsEither<Error, number> = {
    _tag: "Left",
    left: new Error("error"),
  }

  let ser = JSON.stringify(toApiEither(res))

  expect(ser).toMatchInlineSnapshot(`"{"type":"left","left":{"error":"error"}}"`)

  let deser = fromApiEither<number>(JSON.parse(ser))
  expect(deser._tag).toBe("Left")
})

it("transforms successful api either", () => {
  let res: FpTsEither<Error, number> = {
    _tag: "Right",
    right: 5,
  }

  let ser = JSON.stringify(toApiEither(res))

  expect(ser).toMatchInlineSnapshot(`"{"type":"right","right":5}"`)

  let deser = fromApiEither<number>(JSON.parse(ser))
  expect(deser._tag).toBe("Right")
})