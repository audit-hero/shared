/**
 * Tranforms API's format to E.Either<Error, any>. Including changing SimpleError to Error.
 *
 */
export let fromApiEither = (e) => {
    if (!e.type)
        return { _tag: "Left", left: new Error(`fae: Invalid API response ${getStringAny(e)}`) };
    if (e.type === "left") {
        if (!e.left?.error)
            return { _tag: "Left", left: new Error(`fae: Invalid API response ${getStringAny(e)}`) };
        return {
            _tag: "Left",
            left: new Error(e.left.error),
        };
    }
    return {
        _tag: "Right",
        right: e.right,
    };
};
let getStringAny = (e) => {
    try {
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
            type: "left",
            left: simpleError,
        };
    }
    return {
        type: "right",
        right: e.right,
    };
};
//# sourceMappingURL=transform.js.map