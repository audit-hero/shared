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
            left: new Error(e.reason),
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
 * Transfrom E.Either<Error, any> to API's format. Including changing Error to a string.
 *
 * Used in lambda returns
 */
export let toApiEither = (e) => {
    if (e._tag === "Left") {
        let reason;
        if (e.left instanceof Error) {
            reason = e.left.message;
        }
        else if (e.left.error && typeof e.left.error === "string") {
            reason = e.left.error;
        }
        else {
            try {
                reason = `${JSON.stringify(e.left)}`;
            }
            catch (jsonError) {
                reason = `fae: Unknown error ${e.left}`;
            }
        }
        return {
            status: "failure",
            reason,
        };
    }
    return {
        status: "success",
        data: e.right,
    };
};
//# sourceMappingURL=transform.js.map