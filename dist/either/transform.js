/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export let fromApiEither = (e) => {
    if (!e.type)
        return { _tag: "Left", left: new Error("Invalid API response") };
    if (e.type === "left") {
        if (!e.left?.error)
            return { _tag: "Left", left: new Error("Invalid API response") };
        return {
            _tag: "Left",
            left: new Error(e.left.error),
        };
    }
    if (!e.right)
        return { _tag: "Left", left: new Error("Invalid API response") };
    return {
        _tag: "Right",
        right: e.right,
    };
};
/**
 * Transfrom E.Either<Error, any> to API's format. Including changing Error to SimpleError.
 *
 * Used in lambda returns
 */
export let toApiEither = (e) => {
    if (e._tag === "Left") {
        let simpleError;
        if (e.left instanceof Error) {
            simpleError = { error: e.left.message };
        }
        else if (e.left.error && typeof e.left.error === "string") {
            simpleError = { error: e.left.error };
        }
        else {
            try {
                simpleError = { error: `${JSON.stringify(e.left)}` };
            }
            catch (jsonError) {
                simpleError = { error: `Unknown error ${e.left}` };
            }
        }
        return {
            type: "left",
            left: simpleError,
        };
    }
    return {
        type: "right",
        right: e.right,
    };
};
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
//# sourceMappingURL=transform.js.map