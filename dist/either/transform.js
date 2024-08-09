export let apiEitherToFpTsEither = (e) => {
    if (e.type === "left") {
        return {
            _tag: "Left",
            left: e.left,
        };
    }
    return {
        _tag: "Right",
        right: e.right,
    };
};
export let fpTsEitherToApiEither = (e) => {
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
 * Transform Error object to json format with error in `SimpleError` format. Can already input SimpleError as well.
 */
export let toApiEither = (e) => JSON.stringify(fpTsEitherToApiEither(e));
/**
 * Deserializes json string into to E.Either.
 */
export let fromApiEither = (s) => apiEitherToFpTsEither(JSON.parse(s));
//# sourceMappingURL=transform.js.map