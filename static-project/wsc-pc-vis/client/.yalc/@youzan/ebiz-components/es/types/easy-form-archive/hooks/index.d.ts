import { DependencyList, EffectCallback } from 'react';
export declare const useMountState: () => boolean;
export declare const useDepMountState: (deps: DependencyList | undefined, immediate?: boolean) => boolean;
export declare const useUpdateEffect: (fn: EffectCallback, deps: DependencyList, immediate?: boolean) => void;
