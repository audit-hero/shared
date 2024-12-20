# Fp-ts shared lib for client side

Includes some helpful functions to call an fp-ts API. This is for client side only.

## fetchTE

Wraps fetch in a TaskEither, so you can use it with the either monad.

[fetchTEStream](./src/fetch/fetchTE.ts) allows you to stream a response from server. If the request fails, it returns the error as E.left monad.

## Either

Includes some useful functions to work with E.Either style and it's API corresponding type.
