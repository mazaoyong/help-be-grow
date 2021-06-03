import { get, isEqual } from 'lodash';
import { IConfig, Timings } from '../types';

function checkValueEqual(
  prevValue: Record<string, any>,
  curValue: Record<string, any>,
) {
  return function checkEqualInner(key: string): boolean {
    return isEqual(get(prevValue, key), get(curValue, key));
  };
}

export default function invokeLogChecker(
  config: IConfig,
  prevStore: Record<string, any>,
  curStore: Record<string, any>,
) {
  let canInvoke = false;
  if (config.timing === Timings.ChangeByData) {
    const { deps } = config;
    if (deps) {
      if (typeof deps === 'function') {
        canInvoke = deps(prevStore, curStore);
      } else {
        const checkValueEqualWithStore = checkValueEqual(prevStore, curStore);
        if (Array.isArray(deps)) {
          canInvoke = !deps.every(checkValueEqualWithStore);
        } else {
          canInvoke = !checkValueEqualWithStore(deps);
        }
      }
    }
  }
  return canInvoke;
}
