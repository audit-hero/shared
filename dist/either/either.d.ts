export type ApiRight<E> = {
    readonly status: "success";
    readonly data: E | null;
};
export type ApiLeft<A> = {
    readonly status: "failure";
    readonly reason: A;
};
export type FpTsLeft<E> = {
    readonly _tag: "Left";
    readonly left: E;
};
export type FpTsRight<A> = {
    readonly _tag: "Right";
    readonly right: A;
};
export type FpTsEither<E, A> = FpTsLeft<E> | FpTsRight<A>;
