import { it, expect } from "vitest"
import { FpTsEither } from "./either.js"
import { fromApiEither, toApiEither } from "./transform.js"

it("transforms failed api either", () => {
  let res: FpTsEither<Error, number> = {
    _tag: "Left",
    left: new Error("error 1"),
  }

  let ser = JSON.stringify(toApiEither(res))

  expect(ser).toMatchInlineSnapshot(`"{"status":"failure","reason":"error 1"}"`)

  let deser = fromApiEither<number>(JSON.parse(ser))
  expect(deser._tag).toBe("Left")
})

it("transforms successful api either", () => {
  let res: FpTsEither<Error, number> = {
    _tag: "Right",
    right: 5,
  }

  let ser = JSON.stringify(toApiEither(res))

  expect(ser).toMatchInlineSnapshot(`"{"status":"success","data":5}"`)

  let deser = fromApiEither<number>(JSON.parse(ser))
  expect(deser._tag).toBe("Right")
})
