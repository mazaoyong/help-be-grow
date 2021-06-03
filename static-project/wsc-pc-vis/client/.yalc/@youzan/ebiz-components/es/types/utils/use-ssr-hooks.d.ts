import React from 'react';
export declare const useLayoutEffect: typeof React.useLayoutEffect;
export declare const useCallback: typeof React.useCallback;
export declare function genericSSRWrapper<T extends (...args: any[]) => any>(fn: T): T | (() => T);
declare type BooleanFunc = (...args: any[]) => boolean;
export declare function alwaysFalsyInSSR(condition: BooleanFunc | boolean): boolean;
export {};
