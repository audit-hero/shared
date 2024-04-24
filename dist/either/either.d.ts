export type ApiLeft<E> = {
    readonly type: "left";
    readonly left: E;
};
export type ApiRight<A> = {
    readonly type: "right";
    readonly right: A;
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
