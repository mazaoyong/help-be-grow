/**
 * reference [react-use/useDebounce](https://github.com/streamich/react-use/blob/master/src/useTimeoutFn.ts)
 */
import React from 'react';

export type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];

export function useTimeoutFn(fn: Function, ms: number = 0): UseTimeoutFnReturn {
  const ready = React.useRef<boolean | null>(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const callback = React.useRef(fn);

  const isReady = React.useCallback(() => ready.current, []);

  const set = React.useCallback(() => {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);

  const clear = React.useCallback(() => {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // update ref when function changes
  React.useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  React.useEffect(() => {
    set();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms]);

  return [isReady, clear, set];
}
