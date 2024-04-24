export type Result<T> = { ok: true; value: T } | { ok: false; error: any }

export type SimpleError = {
  code?: number
  error: string
}
