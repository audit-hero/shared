import { fromApiEither } from "../either/transform.js";
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
export let fromApiEitherTE = (s) => () => Promise.resolve(fromApiEither(JSON.parse(s)));
export let fetchTE = (input, init) => () => fetch(input, init)
    .then((response) => response.text())
    .then((text) => fromApiEitherTE(text)())
    .catch((error) => Promise.resolve({ _tag: "Left", left: error }));
/**
 * We either stream chat response as string + return it as E.right in the end, or return the error
 * as E.left
 *
 * @param stream - here we stream the E.right content as string before returning the E.right in the
 * end as well.
 * @param options.removeCodeBlock - if true, we trim the stream content between the first ```
 */
export let fetchTEStream = (input, init, stream) => {
    let decoder = new TextDecoder("utf-8");
    let fullRes = "";
    let isError = false;
    let resultFun = async () => (await fetch(input, init)
        .then((response) => response.body)
        .then((body) => body
        ?.pipeTo(new WritableStream({
        write: (bytes) => {
            let chunk = decoder.decode(bytes);
            isError = fullRes === "" && chunk.match(/(\{|\[).*/) !== null;
            if (fullRes === "") {
                if (!isError) {
                    stream(chunk);
                    fullRes += chunk;
                }
                else {
                    stream("");
                    fullRes += chunk.match(/(\{|\[).*/)?.[0] || "";
                }
            }
            else {
                stream(chunk);
                fullRes += chunk;
            }
        },
    }))
        .then(() => {
        let response;
        if (isError) {
            response = fromApiEither(JSON.parse(fullRes));
        }
        else {
            response = { _tag: "Right", right: fullRes };
        }
        return response;
    })
        .catch((err) => {
        let error = `error streaming finding ${err.message}`;
        return { _tag: "Left", left: new Error(error) };
    }))
        .catch((err) => {
        let error = `error streaming fetching ${err.message}`;
        return { _tag: "Left", left: new Error(error) };
    }));
    return resultFun;
};
export { ResponseStream } from "./ResponseStream.js";
//# sourceMappingURL=fetchTE.js.map