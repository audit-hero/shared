/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export let fromApiEither = (e) => {
    if (!e.status)
        return { _tag: "Left", left: new Error(`fae: No status in API response: ${getStringAny(e)}`) };
    if (e.status === "failure") {
        if (!e.reason)
            return { _tag: "Left", left: new Error(`fae: No error reason: ${getStringAny(e)}`) };
        return {
            _tag: "Left",
            left: new Error(e.reason.error),
        };
    }
    return {
        _tag: "Right",
        right: e.data,
    };
};
let getStringAny = (e) => {
    try {
        if (typeof e === "string")
            return e.slice(0, 200);
        if (typeof e === "object")
            return JSON.stringify(e).slice(0, 200);
        return e.toString().slice(0, 200);
    }
    catch (e) {
        return "unknown error";
    }
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
                simpleError = { error: `fae: Unknown error ${e.left}` };
            }
        }
        return {
            status: "failure",
            reason: simpleError,
        };
    }
    return {
        status: "success",
        data: e.right,
    };
};
//# sourceMappingURL=transform.js.map