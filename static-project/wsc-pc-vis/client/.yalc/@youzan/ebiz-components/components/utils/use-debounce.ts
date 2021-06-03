/**
 * reference [react-use/useDebounce](https://github.com/streamich/react-use/blob/master/src/useDebounce.ts)
 */
import React from 'react';
import { useTimeoutFn } from './use-timeout-fn';

export type UseDebounceReturn = [() => boolean | null, () => void];

export function useDebounce(
  fn: Function,
  ms: number = 0,
  deps: React.DependencyList = []
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  React.useEffect(reset, deps);

  return [isReady, cancel];
}
