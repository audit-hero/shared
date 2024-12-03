# Audit-Hero shared lib

Includes types and some helpful functions to call Audit Hero API

## fetchTE

Wraps fetch in a TaskEither, so you can use it with the either monad.


[fetchTEStream](./src/fetch/fetchTE.ts) allows you to stream a response from server. If the request fails, it returns the error as E.left monad.


## sentry

[sentry](./src/sentry/sentry-lambda.ts) allows you to wrap your lambda handlers with sentry error tracking.

```ts
const handler = withSentry({
  name: "my-lambda-function",
  handler: () => {
    // your handler code here. If it throws, it will be sent to sentry
  },
})
```
