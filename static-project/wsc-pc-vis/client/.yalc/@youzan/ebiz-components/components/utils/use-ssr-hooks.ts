import React from 'react';

function useHackEffect(_effect: React.EffectCallback, _deps: React.DependencyList = []) {
  return () => void 0;
}

function useHackCallback<T extends (...args: any[]) => any>(
  _fn: T,
  _deps: React.DependencyList = []
): T {
  return ((() => void 0) as unknown) as T;
}

const isSSR = typeof window === 'undefined';

export const useLayoutEffect = isSSR ? useHackEffect : React.useLayoutEffect;
export const useCallback = isSSR ? useHackCallback : React.useCallback;

// 通用的ssr函数
export function genericSSRWrapper<T extends (...args: any[]) => any>(fn: T) {
  if (isSSR) return () => (void 0 as unknown) as T;
  return fn;
}

// 在SSR下只会返回false
type BooleanFunc = (...args: any[]) => boolean;
export function alwaysFalsyInSSR(condition: BooleanFunc | boolean) {
  if (isSSR) return false;
  return typeof condition === 'function' ? condition() : condition;
}
