/**
 * reference [react-use/useDebounce](https://github.com/streamich/react-use/blob/master/src/useDebounce.ts)
 */
import React from 'react';
export declare type UseDebounceReturn = [() => boolean | null, () => void];
export declare function useDebounce(fn: Function, ms?: number, deps?: React.DependencyList): UseDebounceReturn;
