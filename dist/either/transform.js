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
        return {
            type: "left",
            left: e.left,
        };
    }
    return {
        type: "right",
        right: e.right,
    };
};
export let toApiEither = (e) => JSON.stringify(toApiEither(e));
export let fromApiEither = (s) => apiEitherToFpTsEither(JSON.parse(s));
//# sourceMappingURL=transform.js.map