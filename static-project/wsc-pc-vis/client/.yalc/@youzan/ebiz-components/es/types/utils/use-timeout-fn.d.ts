export declare type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];
export declare function useTimeoutFn(fn: Function, ms?: number): UseTimeoutFnReturn;
